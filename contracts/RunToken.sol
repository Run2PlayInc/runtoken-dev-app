pragma solidity 0.4.19;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";


contract RunToken is StandardToken, Ownable, BurnableToken{
    string public name = "RUNtoken";
    string public symbol = "RUN";
    uint8 public decimals = 18;

    uint public totalSupply_;
    uint public allocated = 0;

    function RunToken() public
    {
        totalSupply_ = 5000000000 * 10**uint(decimals);
        balances[owner] = totalSupply_;
    }
}
