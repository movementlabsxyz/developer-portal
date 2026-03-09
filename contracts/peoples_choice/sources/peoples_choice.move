module peoples_choice::peoples_choice {
    use std::vector;
    use std::signer;
    use aptos_std::simple_map::{Self, SimpleMap};
    use aptos_std::ed25519;
    use aptos_framework::timestamp;
    use std::bcs;

    const E_NOT_ADMIN: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_NOT_INITIALIZED: u64 = 3;
    const E_INVALID_CANDIDATE: u64 = 4;
    const E_ALREADY_VOTED: u64 = 5;
    const E_VOTING_PAUSED: u64 = 6;
    const E_SIGNATURE_EXPIRED: u64 = 7;
    const E_INVALID_SIGNATURE: u64 = 8;

    struct VotingState has key {
        votes: vector<u64>,
        voters: SimpleMap<address, u64>,
        num_candidates: u64,
        is_paused: bool,
        admin: address,
        admin_public_key: ed25519::UnvalidatedPublicKey,
    }

    public entry fun initialize(
        admin: &signer,
        num_candidates: u64,
        admin_public_key: vector<u8>,
    ) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<VotingState>(admin_addr), E_ALREADY_INITIALIZED);

        let votes = vector::empty<u64>();
        let i = 0;
        while (i < num_candidates) {
            vector::push_back(&mut votes, 0);
            i = i + 1;
        };

        move_to(admin, VotingState {
            votes,
            voters: simple_map::create<address, u64>(),
            num_candidates,
            is_paused: false,
            admin: admin_addr,
            admin_public_key: ed25519::new_unvalidated_public_key_from_bytes(admin_public_key),
        });
    }

    public entry fun vote(
        voter: &signer,
        candidate_id: u64,
        signature_bytes: vector<u8>,
        expiry: u64,
    ) acquires VotingState {
        let contract_addr = @peoples_choice;
        assert!(exists<VotingState>(contract_addr), E_NOT_INITIALIZED);

        let state = borrow_global_mut<VotingState>(contract_addr);

        assert!(!state.is_paused, E_VOTING_PAUSED);
        assert!(candidate_id < state.num_candidates, E_INVALID_CANDIDATE);

        let voter_addr = signer::address_of(voter);
        assert!(
            !simple_map::contains_key(&state.voters, &voter_addr),
            E_ALREADY_VOTED,
        );

        assert!(timestamp::now_seconds() < expiry, E_SIGNATURE_EXPIRED);

        let message = bcs::to_bytes(&voter_addr);
        let candidate_bytes = bcs::to_bytes(&candidate_id);
        let expiry_bytes = bcs::to_bytes(&expiry);
        vector::append(&mut message, candidate_bytes);
        vector::append(&mut message, expiry_bytes);

        let sig = ed25519::new_signature_from_bytes(signature_bytes);
        assert!(
            ed25519::signature_verify_strict(
                &sig,
                &state.admin_public_key,
                message,
            ),
            E_INVALID_SIGNATURE,
        );

        let current_count = *vector::borrow(&state.votes, candidate_id);
        *vector::borrow_mut(&mut state.votes, candidate_id) = current_count + 1;
        simple_map::add(&mut state.voters, voter_addr, candidate_id);
    }

    public entry fun pause(admin: &signer) acquires VotingState {
        let contract_addr = @peoples_choice;
        let state = borrow_global_mut<VotingState>(contract_addr);
        assert!(signer::address_of(admin) == state.admin, E_NOT_ADMIN);
        state.is_paused = true;
    }

    public entry fun unpause(admin: &signer) acquires VotingState {
        let contract_addr = @peoples_choice;
        let state = borrow_global_mut<VotingState>(contract_addr);
        assert!(signer::address_of(admin) == state.admin, E_NOT_ADMIN);
        state.is_paused = false;
    }

    #[view]
    public fun get_votes(): vector<u64> acquires VotingState {
        let contract_addr = @peoples_choice;
        if (!exists<VotingState>(contract_addr)) {
            return vector::empty<u64>()
        };
        let state = borrow_global<VotingState>(contract_addr);
        state.votes
    }

    #[view]
    public fun has_voted(addr: address): bool acquires VotingState {
        let contract_addr = @peoples_choice;
        if (!exists<VotingState>(contract_addr)) {
            return false
        };
        let state = borrow_global<VotingState>(contract_addr);
        simple_map::contains_key(&state.voters, &addr)
    }

    #[view]
    public fun get_voter_choice(addr: address): u64 acquires VotingState {
        let contract_addr = @peoples_choice;
        let state = borrow_global<VotingState>(contract_addr);
        *simple_map::borrow(&state.voters, &addr)
    }
}
