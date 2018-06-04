const DummyToken = artifacts.require("./DummyToken.sol");
const TokenDistributor = artifacts.require("./TokenDistributor.sol");
const deployConfig = {

}

let me;
const newDummy = () => DummyToken.new();
const newDistributor = (_token, _stakeHoldersCount, _stakeHolders) => {
  return TokenDistributor.new(
    _token, _stakeHoldersCount, _stakeHolders
  )
}

contract('==TokenDistributor==', (accounts) => {
  let token;
  let instance;
  me = accounts[0];
  const stakeHoldersCount = Math.floor((accounts.length-3) * Math.random()) + 1;
  const stakeHolders = accounts.filter( (account, index) => {
    return index > 0 && index < (stakeHoldersCount+1);
  })
  console.log('Total StakeHolders: ', stakeHoldersCount)
  console.log('StakeHolders: ', stakeHolders)

  it('Should deploy the Contract', async () => {
    await newDummy().then((_instance) => {
      token = _instance;
    }).then( async () => {
      await newDistributor(
        token.address,
        stakeHoldersCount,
        stakeHolders
      ).then((_instance) => {
        instance = _instance;
        web3 = instance.constructor.web3;
      })
    })

    console.log('Web3: ', web3.version.api ? web3.version.api : web3.version);
    console.log('Token: ', token.address)
    console.log('TokenDistributor: ',instance.address)
  })

  describe('setStakeholder()', () => {

    it('Should fail to access setHolder', () => {
      assert.strictEqual(instance.setStakeholder, undefined, 'setStakeholder function could be accessed');
    })
  })

  describe('_transfer()', () => {

    it('Should fail to access setHolder', () => {
      assert.strictEqual(instance._transfer, undefined, '_transfer function could be accessed');
    })
  })

  describe('_transferRemaining()', () => {

    it('Should fail to access setHolder', () => {
      assert.strictEqual(instance._transferRemaining, undefined, '_transfer function could be accessed');
    })
  })
})
