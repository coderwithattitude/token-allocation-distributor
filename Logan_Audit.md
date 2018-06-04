General Notes
-------------
- [x] TokenDistributor.sol and WeightedTokenDistributor.sol are pegged to compiler
version 0.4.23 but the latest compiler used by Truffle version 4.1.11 is
0.4.24. Please upgrade the contracts to use the latest compiler version.  
- [x] In some parts of the code, "stakeHolders" are capitalized like so, "StakeHolders"
while in other parts the "h" is small like "Stakeholders". it is recommened
to change all variables to confirm to one or the other.

TokenDistributor
----------------

- [x] Care should be taken that `maxStakeHolders` is a number that is
sufficiently low that it will not cause an OOG error when running the
`distribute()` function.  
- [x] Recommened to make `targetToken`, `stakeHolders`, and `maxStakeHolders`
variables `public` so that getter functions are automatically generated for them.

WeightedTokenDistributor
------------------------

- [x] The revert message in line 34 should mention to indicate the total
weight as well as the stakeholder to urge the complete function arguments
to the function.  
- [x] Must specify the `TokenDistributor` constructor arguments in the constructor
of the contract. [See PR]

tokenDistributor.js
-------------------

- [x] Rename `tokenDistriutor` to `tokenDistributor` for correctness
