/// Walrus Insight Engine - Player Insight NFT Module
module walrus_insight::insight_nft {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{TxContext};
    use sui::event;
    use sui::clock::{Self, Clock};
    use std::string::String;

    /// PlayerInsight NFT
    public struct PlayerInsight has key, store {
        id: UID,
        player: address,
        walrus_blob_id: String,
        content_hash: String,
        tier: u8,
        total_spend_cents: u64,
        fraud_score: u8,
        last_updated: u64,
        analysis_date: String,
    }

    /// Event when NFT is minted
    public struct InsightMinted has copy, drop {
        nft_id: address,
        player: address,
        tier: u8,
    }

    /// Mint a new PlayerInsight NFT
    public entry fun mint_insight(
        walrus_blob_id: String,
        content_hash: String,
        tier: u8,
        total_spend_cents: u64,
        fraud_score: u8,
        analysis_date: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        let uid = object::new(ctx);
        let nft_address = object::uid_to_address(&uid);

        let nft = PlayerInsight {
            id: uid,
            player: sender,
            walrus_blob_id,
            content_hash,
            tier,
            total_spend_cents,
            fraud_score,
            last_updated: clock::timestamp_ms(clock),
            analysis_date,
        };

        event::emit(InsightMinted {
            nft_id: nft_address,
            player: sender,
            tier,
        });

        transfer::public_transfer(nft, sender);
    }

    /// Get player address
    public fun get_player(nft: &PlayerInsight): address {
        nft.player
    }

    /// Get blob ID
    public fun get_blob_id(nft: &PlayerInsight): &String {
        &nft.walrus_blob_id
    }

    /// Get tier
    public fun get_tier(nft: &PlayerInsight): u8 {
        nft.tier
    }
}
