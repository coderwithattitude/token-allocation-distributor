pragma solidity 0.4.23;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol";

contract TokenDistributor is Ownable {
    using SafeMath for uint;

    address targetToken;
    address [] stakeHolders;
    uint256 maxStakeHolders;

    constructor (_targetToken,_totalStakeHolders) Ownable() {
      maxStakeHolders = _totalStakeHolders;
    }

    function countStakeholders () public view returns (uint256) {
      return stakeHolders.length;
    }

    function getTokenBalance(address _token) public view returns (uint256) {
      ERC20Basic token = ERC20Basic(_token);
      return token.balanceOf(address(this));
    }

    function getPortion (_total) public view returns (uint256) {
      return total.div(stakeHolders.length);
    }

    function setStakeholder (_stakeHolder) public onlyOwner returns (bool) {
      require(countStakeholders() < maxStakeHolders, 'Max StakeHolders set');
      stakeHolders.push(_stakeHolder);
      return true;
    }

    function _transfer(address _token, address _recipient, uint256 _value) internal {
      ERC20Basic token = ERC20Basic(_token);
      token.transfer(_recipient, _value);
    }

    function distribute (address _token) public returns (bool) {
        uint256 balance = getTokenBalance(_token);
        uint256 perStakeHolder = getPortion(balance);
        for (uint256 count = 0; count < stakeHolders.length; count++) {
          _transfer(_token, stakeHolders[count], perStakeHolder);
        }
        return true;
    }

    function () public {
      distribute(targetToken);
    }
}
