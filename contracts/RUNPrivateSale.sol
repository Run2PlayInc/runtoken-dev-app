pragma solidity 0.4.19;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";

contract PrivateSaleVestor{
    function grantVesting(
        address _token,
        address _to,
        uint256 _vestedAmount,
        uint256 _startTime,
        uint256 _grantPeriod,
        uint256 _cliffPeriod)
    external;

    function deposit(address _token, uint256 _amount)
    external
    returns(uint256);
}

contract RUNPrivateSale is Crowdsale{

    address public ethWallet;
    //TODO Dynamic rate
    uint256 public rate = 16000;
    uint256 public price = 1 / rate;
    uint public tokensForSale = 50000000 * 10**uint(18);
    address public tokenAddress;
    address public vestAddress;

    uint256 blockStart ;

    StandardToken dTok;
    PrivateSaleVestor vester;

    function RUNPrivateSale(
        address _ethWallet,
        address _tokenAddress,
        address _vestAddress
    )
    Crowdsale(rate, _ethWallet, StandardToken(_tokenAddress))
    public
    {
        ethWallet    = _ethWallet;
        tokenAddress = _tokenAddress;
        vestAddress  = _vestAddress;
        dTok         = StandardToken(tokenAddress);
        vester       = PrivateSaleVestor(vestAddress);
        blockStart   = block.timestamp;
    }

    function () external payable {
        uint ethAmount = msg.value;
        require(price < ethAmount);

        uint numTokens = ethAmount * rate;
        address _addr = ethWallet;
        _addr.transfer(ethAmount);

        dTok.approve(vestAddress, numTokens*5);
        vester.deposit(tokenAddress, numTokens*5);
        vester.grantVesting(tokenAddress, msg.sender, numTokens*5, blockStart+100, 5000 * 5, 0);
    }
}
