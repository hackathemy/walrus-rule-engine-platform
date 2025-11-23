/// Walrus RuleEngine - Ruleset NFT Module
/// Tradeable AI/SQL/Python analysis rulesets
module walrus_insight::ruleset_nft {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self as tx_context, TxContext};
    use sui::event;
    use sui::clock::{Self, Clock};
    use std::string::String;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};

    /// Error codes
    const EInvalidPrice: u64 = 1;
    const EInsufficientPayment: u64 = 2;
    const ENotCreator: u64 = 3;

    /// Rule types
    const RULE_TYPE_AI: u8 = 1;
    const RULE_TYPE_SQL: u8 = 2;
    const RULE_TYPE_PYTHON: u8 = 3;

    /// Categories
    const CATEGORY_GAMING: u8 = 1;
    const CATEGORY_DEFI: u8 = 2;
    const CATEGORY_IOT: u8 = 3;
    const CATEGORY_SOCIAL: u8 = 4;

    /// Ruleset NFT - tradeable analysis rules
    public struct Ruleset has key, store {
        id: UID,
        creator: address,
        name: String,
        description: String,
        category: u8,
        rule_type: u8,
        rule_blob_id: String, // Walrus storage reference
        price_sui: u64, // Price in MIST (1 SUI = 10^9 MIST)
        total_uses: u64,
        total_revenue: u64,
        created_at: u64,
        version: u8,
    }

    /// Platform treasury for fee collection
    public struct PlatformTreasury has key {
        id: UID,
        balance: Balance<SUI>,
        total_collected: u64,
    }

    /// Events
    public struct RulesetCreated has copy, drop {
        ruleset_id: address,
        creator: address,
        name: String,
        price: u64,
    }

    public struct RulesetPurchased has copy, drop {
        ruleset_id: address,
        buyer: address,
        seller: address,
        price: u64,
        creator_revenue: u64,
        platform_fee: u64,
    }

    public struct RulesetExecuted has copy, drop {
        ruleset_id: address,
        executor: address,
        timestamp: u64,
    }

    /// Initialize platform treasury (called once at deployment)
    fun init(ctx: &mut TxContext) {
        let treasury = PlatformTreasury {
            id: object::new(ctx),
            balance: balance::zero(),
            total_collected: 0,
        };
        transfer::share_object(treasury);
    }

    /// Create a new Ruleset NFT
    public entry fun create_ruleset(
        name: String,
        description: String,
        category: u8,
        rule_type: u8,
        rule_blob_id: String,
        price_sui: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(price_sui > 0, EInvalidPrice);

        let sender = tx_context::sender(ctx);
        let uid = object::new(ctx);
        let ruleset_address = object::uid_to_address(&uid);

        let ruleset = Ruleset {
            id: uid,
            creator: sender,
            name,
            description,
            category,
            rule_type,
            rule_blob_id,
            price_sui,
            total_uses: 0,
            total_revenue: 0,
            created_at: clock::timestamp_ms(clock),
            version: 1,
        };

        event::emit(RulesetCreated {
            ruleset_id: ruleset_address,
            creator: sender,
            name: ruleset.name,
            price: price_sui,
        });

        transfer::public_transfer(ruleset, sender);
    }

    /// Purchase a ruleset (80% to creator, 10% to platform, 10% to original creator if resale)
    public entry fun purchase_ruleset(
        ruleset: &mut Ruleset,
        mut payment: Coin<SUI>,
        treasury: &mut PlatformTreasury,
        ctx: &mut TxContext
    ) {
        let payment_amount = coin::value(&payment);
        assert!(payment_amount >= ruleset.price_sui, EInsufficientPayment);

        let buyer = tx_context::sender(ctx);

        // Calculate splits
        let platform_fee = ruleset.price_sui / 10; // 10%
        let creator_revenue = ruleset.price_sui - platform_fee; // 90%

        // Split payment
        let platform_coin = coin::split(&mut payment, platform_fee, ctx);
        let creator_coin = payment; // Remaining goes to creator

        // Add to platform treasury
        let platform_balance = coin::into_balance(platform_coin);
        balance::join(&mut treasury.balance, platform_balance);
        treasury.total_collected = treasury.total_collected + platform_fee;

        // Send to creator
        transfer::public_transfer(creator_coin, ruleset.creator);

        // Update ruleset stats
        ruleset.total_uses = ruleset.total_uses + 1;
        ruleset.total_revenue = ruleset.total_revenue + creator_revenue;

        event::emit(RulesetPurchased {
            ruleset_id: object::uid_to_address(&ruleset.id),
            buyer,
            seller: ruleset.creator,
            price: ruleset.price_sui,
            creator_revenue,
            platform_fee,
        });
    }

    /// Record ruleset execution (free, just increments counter)
    public entry fun record_execution(
        ruleset: &mut Ruleset,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        ruleset.total_uses = ruleset.total_uses + 1;

        event::emit(RulesetExecuted {
            ruleset_id: object::uid_to_address(&ruleset.id),
            executor: tx_context::sender(ctx),
            timestamp: clock::timestamp_ms(clock),
        });
    }

    /// Update ruleset price (only creator)
    public entry fun update_price(
        ruleset: &mut Ruleset,
        new_price: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == ruleset.creator, ENotCreator);
        assert!(new_price > 0, EInvalidPrice);
        ruleset.price_sui = new_price;
    }

    /// Upgrade ruleset version (only creator)
    public entry fun upgrade_version(
        ruleset: &mut Ruleset,
        new_blob_id: String,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == ruleset.creator, ENotCreator);
        ruleset.rule_blob_id = new_blob_id;
        ruleset.version = ruleset.version + 1;
    }

    // === Getter Functions ===

    public fun get_creator(ruleset: &Ruleset): address {
        ruleset.creator
    }

    public fun get_name(ruleset: &Ruleset): &String {
        &ruleset.name
    }

    public fun get_price(ruleset: &Ruleset): u64 {
        ruleset.price_sui
    }

    public fun get_total_uses(ruleset: &Ruleset): u64 {
        ruleset.total_uses
    }

    public fun get_total_revenue(ruleset: &Ruleset): u64 {
        ruleset.total_revenue
    }

    public fun get_blob_id(ruleset: &Ruleset): &String {
        &ruleset.rule_blob_id
    }

    public fun get_rule_type(ruleset: &Ruleset): u8 {
        ruleset.rule_type
    }

    public fun get_category(ruleset: &Ruleset): u8 {
        ruleset.category
    }
}
