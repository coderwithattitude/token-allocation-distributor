pragma solidity 0.4.23;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol";

contract TokenDistributor is Ownable {
    using SafeMath for uint;

    address targetToken;
    address [] stakeHolders;
    uint256 maxStakeHolders;
    event InsufficientTokenBalance( address indexed _token, uint256 _time );
    event TokensDistributed( address indexed _token, uint256 _total, uint256 _time );

    constructor ( address _targetToken, uint256 _totalStakeHolders, address[] _stakeHolders) public Ownable() {
      targetToken = _targetToken;
      maxStakeHolders = _totalStakeHolders;
      if (_stakeHolders.length > 0) {
        for (uint256 count = 0; count < stakeHolders.length && count < _totalStakeHolders; count++) {
          setStakeholder( stakeHolders[count] );
        }
      }
    }

    function isDistributionDue () public view returns (bool) {
      return getTokenBalance(targetToken) > 1;
    }

    function countStakeholders () public view returns (uint256) {
      return stakeHolders.length;
    }

    function getTokenBalance(address _token) public view returns (uint256) {
      ERC20Basic token = ERC20Basic(_token);
      return token.balanceOf(address(this));
    }

    function getPortion (uint256 _total) public view returns (uint256) {
      return _total.div(stakeHolders.length);
    }

    function setStakeholder (address _stakeHolder) public onlyOwner returns (bool) {
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

        if (balance < 1) {
          emit InsufficientTokenBalance( _token, block.timestamp );
          return false;
        } else {
          for (uint256 count = 0; count < stakeHolders.length; count++) {
            _transfer(_token, stakeHolders[count], perStakeHolder);
          }
          emit TokensDistributed( _token, balance, block.timestamp );
          return true;
        }
    }

    function () public {
      distribute(targetToken);
    }
}
