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

        // console.log(initialStakeholders)

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

    // it('Correctly returns the stakeHolders array', async () => {
    //     const returnedStakeHolders = await weightedTokenDistributor.stakeHolders(0);

    //     const expectedStakeHolders = initialStakeholders;

    //     assert.strictEqual(
    //         returnedStakeHolders,
    //         expectedStakeHolders,
    //         "The expected stakeHolders array was returned from the Weighted Token Distribution."
    //     );
    // })

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


})