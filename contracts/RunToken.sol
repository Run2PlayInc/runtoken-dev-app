pragma solidity 0.4.19;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";


contract RunToken is StandardToken{
    string public name      = "RUNtoken";
    string public symbol    = "RUN";
    uint8 public decimals   = 18;
    uint public totalSupply = 5000000000 * 10**uint(decimals);
    uint public allocated   = 0;

    //Initial Allocations to Wallets Addresses
    address public privateSaleWallet;
    address public teamPoolWallet;
    address public whitelistSaleWallet;
    address public preAndPublicSalesWallet;


    function RunToken(address _privateSaleWallet, address _teamPoolWallet, address _whitelistSaleWallet, address _preAndPublicSalesWallet) public
    {

        privateSaleWallet       = _privateSaleWallet;
        teamPoolWallet          = _teamPoolWallet;
        whitelistSaleWallet     = _whitelistSaleWallet;
        preAndPublicSalesWallet = _preAndPublicSalesWallet;

        //Team Address Coins
        uint teamPoolSupply = 1500000000 * 10**uint(decimals);
        balances[teamPoolWallet] = teamPoolSupply;
        Transfer(address(0), teamPoolWallet, teamPoolSupply);

        //Private Sale Address Coins
        uint privateSaleSupply = 250000000 * 10**uint(decimals);
        balances[privateSaleWallet] = privateSaleSupply;
        Transfer(address(0), privateSaleWallet, privateSaleSupply);

        //WhiteList Sale Address Coins
        uint whitelistSaleSupply = 150000000 * 10**uint(decimals);
        balances[whitelistSaleWallet] = whitelistSaleSupply;
        Transfer(address(0), whitelistSaleWallet, whitelistSaleSupply);

        //PreSale1 + PreSale2 + PublicSale Address Coins
        uint remainder = totalSupply - (balances[teamPoolWallet] + balances[privateSaleWallet] + balances[whitelistSaleWallet]);
        balances[preAndPublicSalesWallet] = remainder;
        Transfer(address(0), preAndPublicSalesWallet, remainder);
    }

    function transfer(address to, uint256 value) public returns (bool) {
      super.transfer(to, value);
    }

}
