pragma solidity 0.4.23;

import "./TokenDistributor.sol";

contract WeightedTokenDistributor is TokenDistributor {
    using SafeMath for uint;

    mapping( address => uint256) stakeHoldersWeight;

    constructor ( address _targetToken, uint256 _totalStakeHolders, address[] _stakeHolders, uint256[] _weights) public Ownable() {
      targetToken = _targetToken;
      maxStakeHolders = _totalStakeHolders;
      if (_stakeHolders.length > 0) {
        for (uint256 count = 0; count < stakeHolders.length && count < _totalStakeHolders; count++) {
          if (stakeHolders[count] != 0x0) {
            setStakeholder( stakeHolders[count], _weights[count] );
          }
        }
      }
    }

    function getTotalWeight () public view returns (uint256 _total) {
      for (uint256 count = 0; count < stakeHolders.length; count++) {
        _total = _total.add( stakeHoldersWeight[stakeHolders[count]] );
      }
    }

    function getPortion (uint256 _total, uint256 _totalWeight, address _stakeHolder) public view returns (uint256) {
      uint256 weight = stakeHoldersWeight[_stakeHolder];
      return (_total.mul(weight)).div(_totalWeight);
    }

    function getPortion (uint256 _total) public view returns (uint256) {
      revert('Kindly indicate stakeHolder');
    }

    function setStakeholder (address _stakeHolder, uint256 _weight) internal onlyOwner returns (bool) {
      stakeHoldersWeight[_stakeHolder] = _weight;
      require(super.setStakeholder(_stakeHolder));
      return true;
    }

    function setStakeholder (address _stakeHolder) internal onlyOwner returns (bool) {
      revert('Kindly set Weights for stakeHolder');
    }

    function distribute (address _token) public returns (bool) {
        uint256 balance = getTokenBalance(_token);
        uint256 totalWeight = getTotalWeight();

        if (balance < 1) {
          emit InsufficientTokenBalance( _token, block.timestamp );
          return false;
        } else {
          for (uint256 count = 0; count < stakeHolders.length; count++) {
            uint256 perStakeHolder = getPortion(balance, totalWeight, stakeHolders[count]);
            _transfer(_token, stakeHolders[count], perStakeHolder);
          }

          uint256 newBalance = getTokenBalance(_token);
          if (newBalance > 0) {
            _transfer(_token, owner, newBalance);
          }

          emit TokensDistributed( _token, balance, block.timestamp );
          return true;
        }
    }
}
