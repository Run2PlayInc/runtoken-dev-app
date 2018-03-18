const RUNPrivateSale = artifacts.require('./contacts/RUNPrivateSale.sol');
const RunToken = artifacts.require('./contracts/RunToken.sol');
const PrivateSaleVestor = artifacts.require('./contracts/PrivateSaleVester.sol');
var abiArray = [     {
                       "constant": false,
                       "inputs": [
                         {
                           "name": "to",
                           "type": "address"
                         },
                         {
                           "name": "value",
                           "type": "uint256"
                         }
                       ],
                       "name": "transfer",
                       "outputs": [
                         {
                           "name": "",
                           "type": "bool"
                         }
                       ],
                       "payable": false,
                       "stateMutability": "nonpayable",
                       "type": "function"
                     }]


module.exports = function(deployer, network, accounts) {
//    const openingTime = web3.eth.getBlock('latest').timestamp + 2; // two secs in the future
//    const closingTime = openingTime + 86400 * 1; // 1 days
//    const rate = new web3.BigNumber(1000);
//    const price = new web3.BigNumber(16000);
      const wallet                  = accounts[1];
      //accounts[1]
      const privateSaleWallet       = "0xa8dc7b06d92c991745c69909fc9b4a426397815c";
      //accounts[2]
      const teamPoolWallet          = "0x7258d88dff42dd2d08b2bb42889dd0a52cc1548b";
      //accounts[3]
      const whitelistSaleWallet     = "0x408c628c34f5ffbda2f5cd9d71cb75282155fd80";
      //accounts[4]
      const preAndPublicSalesWallet = "0xece719c9691c1d6218a7204ff12fe8274225396b";


      deployer.then(function() {
        return deployer.deploy(RunToken, privateSaleWallet, teamPoolWallet, whitelistSaleWallet, preAndPublicSalesWallet);
      }).then(function() {
        console.log("[[[[[RunToken Address: " + RunToken.address+" ]]]]]");
        return deployer.deploy(PrivateSaleVestor);
      }).then(function() {
        console.log("[[[[[RunToken Address: " + PrivateSaleVestor.address+" ]]]]]");
        return deployer.deploy(RUNPrivateSale, wallet, RunToken.address, PrivateSaleVestor.address);
      }).then(function(){
        console.log("[[[[[RunToken Address: " + RUNPrivateSale.address+" ]]]]]");
      }).then(function(){
        //SEND FUNDS
        var contract = web3.eth.contract(abiArray).at(RunToken.address);
        var rawTransaction = {
          "from": wallet,
          "to": RUNPrivateSale.address,
          "value": 250000000,
          "data": null
        };
        rawTransaction.data = contract.transfer.getData(RUNPrivateSale.address, rawTransaction.value);
        console.log(rawTransaction.data);
      });







};
