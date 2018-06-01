pragma solidity 0.4.23;

import "./TokenDistributor.sol";

contract WeightedTokenDistributor is TokenDistributor {
    using SafeMath for uint;

    uint256 [] stakeHoldersWeight;

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

    function getStakeHolderIndex (address _stakeHolder) public view returns (uint256 _index) {
      _index = stakeHolders.length+1; //Indicate not found
      for (uint256 count = 0; count < stakeHolders.length; count++) {
        if (stakeHolders[count] == _stakeHolder) {
          _index = count;
          break;
        }
      }
    }

    function getTotalWeight () public view returns (uint256 _total) {
      for (uint256 count = 0; count < stakeHolders.length; count++) {
        _total = _total.add( stakeHoldersWeight[count] );
      }
    }

    function getPortion (uint256 _total, address _stakeHolder) public view returns (uint256) {
      uint256 index = getStakeHolderIndex(_stakeHolder);
      uint256 weight = stakeHoldersWeight[index];
      uint256 totalWeight = getTotalWeight();
      return (_total.mul(weight)).div(totalWeight);
    }

    function getPortion (uint256 _total) public view returns (uint256) {
      revert('Kindly indicate stakeHolder');
    }

    function setStakeholder (address _stakeHolder, uint256 _weight) public onlyOwner returns (bool) {
      stakeHoldersWeight.push(_weight);
      require(super.setStakeholder(_stakeHolder));
      return true;
    }

    function setStakeholder (address _stakeHolder) public onlyOwner returns (bool) {
      revert('Kindly set Weights for stakeHolder');
    }

    function distribute (address _token) public returns (bool) {
        uint256 balance = getTokenBalance(_token);

        if (balance < 1) {
          emit InsufficientTokenBalance( _token, block.timestamp );
          return false;
        } else {
          for (uint256 count = 0; count < stakeHolders.length; count++) {
            uint256 perStakeHolder = getPortion(balance, stakeHolders[count]);
            _transfer(_token, stakeHolders[count], perStakeHolder);
          }
          emit TokensDistributed( _token, balance, block.timestamp );
          return true;
        }
    }
}
