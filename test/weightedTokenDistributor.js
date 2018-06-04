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

    it('Correctly calculates the weight', async () => {
        const returnedWeight = await weightedTokenDistributor.getTotalWeight();

        const expectedWeight = initialWeights.reduce((a,b) => a+b, 0);
        
        assert.strictEqual(
            returnedWeight.toNumber(),
            expectedWeight,
            "The expected weight was returned from the Weighted Token Disctributor."
        );
    })


})