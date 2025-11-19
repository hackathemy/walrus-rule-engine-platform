/// Walrus RuleEngine - Analysis Result NFT
/// Verifiable analysis outputs with data provenance
module walrus_insight::analysis_result {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{TxContext};
    use sui::event;
    use sui::clock::{Self, Clock};
    use std::string::String;

    /// Error codes
    const EInvalidData: u64 = 1;

    /// AnalysisResult NFT - proof of analysis execution
    public struct AnalysisResult has key, store {
        id: UID,
        executor: address,
        data_blob_id: String, // Original data on Walrus
        ruleset_id: ID, // Which ruleset was used
        result_blob_id: String, // Analysis output on Walrus
        verification_hash: String, // SHA-256 of result
        executed_at: u64,
        execution_time_ms: u64, // How long it took
        cost_sui: u64, // Execution cost
    }

    /// Dataset registration (optional, for public datasets)
    public struct Dataset has key, store {
        id: UID,
        owner: address,
        name: String,
        description: String,
        blob_id: String,
        schema_hash: String,
        row_count: u64,
        is_public: bool,
        access_price: u64, // 0 if free
        created_at: u64,
    }

    /// Events
    public struct AnalysisCompleted has copy, drop {
        result_id: address,
        executor: address,
        ruleset_id: ID,
        data_blob_id: String,
        timestamp: u64,
    }

    public struct DatasetRegistered has copy, drop {
        dataset_id: address,
        owner: address,
        name: String,
        is_public: bool,
    }

    /// Mint AnalysisResult NFT
    public entry fun mint_result(
        data_blob_id: String,
        ruleset_id: ID,
        result_blob_id: String,
        verification_hash: String,
        execution_time_ms: u64,
        cost_sui: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let executor = ctx.sender();
        let uid = object::new(ctx);
        let result_address = object::uid_to_address(&uid);

        let result = AnalysisResult {
            id: uid,
            executor,
            data_blob_id,
            ruleset_id,
            result_blob_id,
            verification_hash,
            executed_at: clock::timestamp_ms(clock),
            execution_time_ms,
            cost_sui,
        };

        event::emit(AnalysisCompleted {
            result_id: result_address,
            executor,
            ruleset_id,
            data_blob_id,
            timestamp: clock::timestamp_ms(clock),
        });

        transfer::public_transfer(result, executor);
    }

    /// Register a dataset for others to use
    public entry fun register_dataset(
        name: String,
        description: String,
        blob_id: String,
        schema_hash: String,
        row_count: u64,
        is_public: bool,
        access_price: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let owner = ctx.sender();
        let uid = object::new(ctx);
        let dataset_address = object::uid_to_address(&uid);

        let dataset = Dataset {
            id: uid,
            owner,
            name,
            description,
            blob_id,
            schema_hash,
            row_count,
            is_public,
            access_price,
            created_at: clock::timestamp_ms(clock),
        };

        event::emit(DatasetRegistered {
            dataset_id: dataset_address,
            owner,
            name,
            is_public,
        });

        // Share object so others can read metadata
        transfer::share_object(dataset);
    }

    // === Getter Functions ===

    public fun get_executor(result: &AnalysisResult): address {
        result.executor
    }

    public fun get_data_blob_id(result: &AnalysisResult): &String {
        &result.data_blob_id
    }

    public fun get_result_blob_id(result: &AnalysisResult): &String {
        &result.result_blob_id
    }

    public fun get_verification_hash(result: &AnalysisResult): &String {
        &result.verification_hash
    }

    public fun get_execution_time(result: &AnalysisResult): u64 {
        result.execution_time_ms
    }

    public fun get_dataset_blob_id(dataset: &Dataset): &String {
        &dataset.blob_id
    }

    public fun is_dataset_public(dataset: &Dataset): bool {
        dataset.is_public
    }

    public fun get_dataset_price(dataset: &Dataset): u64 {
        dataset.access_price
    }
}
