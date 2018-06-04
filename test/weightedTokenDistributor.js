const DummyToken = artifacts.require("./DummyToken.sol")
const WeightedTokenDistributor = artifacts.require("./WeightedTokenDistributor.sol")

contract("Weighted Token Distributor", (accounts) => {
    const default_account = accounts[0];

    let dummyToken;
    let weightedTokenDistributor;

    const totalStakeholders = 3;
    const initialStakeholderCount = 3;

    const initialStakeholders = accounts.slice(1, initialStakeholderCount+1);
    const initialWeights = [
        3,
        2,
        5,
    ];

    before(async () => {
        dummyToken = await DummyToken.new();
        assert(dummyToken.address, "Dummy Token was deployed and has an address.");

        weightedTokenDistributor = await WeightedTokenDistributor.new(
            dummyToken.address,
            totalStakeholders,
            initialStakeholders,
            initialWeights,
        );

        assert(weightedTokenDistributor.address, "Weighted Token Distributor was deployed and has an address.");
    })

    it("Correctly returns the targetToken", async () => {
        const returnedToken = await weightedTokenDistributor.targetToken();

        const expectedToken = dummyToken.address;
        assert.strictEqual(
            returnedToken,
            expectedToken,
            "The expected token was returned from the Weighted Token Distributor."
        );
    })

    it('Correctly returns the stakeHolders array', async () => {
        const returnedStakeHolders = await weightedTokenDistributor.stakeHolders(2);

        const expectedStakeHolders = initialStakeholders[2];

        assert.strictEqual(
            returnedStakeHolders,
            expectedStakeHolders,
            "The expected stakeHolders array was returned from the Weighted Token Distribution."
        );
    })

    it("Correctly returns the maxStakeHolders", async () => {
        const returnedMaxStakeHolders = await weightedTokenDistributor.maxStakeHolders();

        const expectedMaxStakeHolders = totalStakeholders;
        assert.strictEqual(
            returnedMaxStakeHolders.toNumber(),
            expectedMaxStakeHolders,
            "The expected maxStakeHolders was returned from the Weighted Token Distributor."
        );
    })

    it('Correctly counts stakeHolders', async () => {
        const returnedCount = await weightedTokenDistributor.countStakeholders();

        const expectedCount = initialStakeholderCount;

        assert.strictEqual(
            returnedCount.toNumber(),
            expectedCount,
            "The expected count was returned from the Weighted Token Distributor."
        );
    })

    it('Correctly calculates the weight', async () => {
        const returnedWeight = await weightedTokenDistributor.getTotalWeight();

        const expectedWeight = initialWeights.reduce((a,b) => a+b, 0);
        
        assert.strictEqual(
            returnedWeight.toNumber(),
            expectedWeight,
            "The expected weight was returned from the Weighted Token Distributor."
        );
    })

    it('Reverts on using `getPortion` without a weight param', async () => {
        // assert.throws(await weightedTokenDistributor.getPortion(3));
    })

    it('Correctly calculates the portion according to the weight passed', async () => {
        const returnedPortion = await weightedTokenDistributor.getPortion(100, 10, initialStakeholders[0]);

        const expectedPortion = 100 * 3 / 10;

        assert.strictEqual(
            returnedPortion.toNumber(),
            expectedPortion,
            "The expected portion was returned from the Weighted Token Distributor."
        );
    })

    it('Correctly distributes 100 tokens', async () => {
        await dummyToken.mint(
            weightedTokenDistributor.address,
            100,
            {
                from: default_account,
            }
        );

        const returnedBalance = await weightedTokenDistributor.getTokenBalance(dummyToken.address);
        assert.strictEqual(
            returnedBalance.toNumber(),
            100,
            "Created 100 dummyTokens to Weighted Token Distributor."
        );

        // Check the balances of the stakeHolders and assert they === 0
        // before the transfers take place.
        initialStakeholders.map(async (stakeholder) => {
            assert.strictEqual(
                (await dummyToken.balanceOf(stakeholder)).toNumber(),
                0,
                `${stakeholder} balance === 0`
            );
        });

        const expectedBalances = [
            30,
            20,
            50,
        ];

        await weightedTokenDistributor.distribute(dummyToken.address);

        initialStakeholders.map(async (stakeholder, idx) => {
            assert.strictEqual(
                (await dummyToken.balanceOf(stakeholder)).toNumber(),
                expectedBalances[idx],
                "Each stakeholder was given the correct weighted balance."
            );
        });
    })
})