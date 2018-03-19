var config = require('../config.json')

const RUNPrivateSale = artifacts.require('./contacts/RUNPrivateSale.sol');
const RunToken = artifacts.require('./contracts/RunToken.sol');
const PrivateSaleVestor = artifacts.require('./contracts/PrivateSaleVester.sol');

var transferAbi = [{"constant": false,"inputs": [{"name": "to","type": "address"}, {"name": "value","type": "uint256" }],"name": "transfer","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"}];

module.exports = function(deployer, network, accounts) {

      const wallet                  = accounts[1];
      //accounts[1]
      const privateSaleWallet       = config.wallets.privateSaleWallet;

      deployer.then(function() {
        return deployer.deploy(RunToken);
      }).then(function() {
        return deployer.deploy(PrivateSaleVestor);
      }).then(function() {
        return deployer.deploy(RUNPrivateSale, wallet, RunToken.address, PrivateSaleVestor.address);
      }).then(function(){
        console.log("[[[[[RunToken Address: "            + RunToken.address+" ]]]]]");
        console.log("[[[[[Private Sale Vestor Address: " + PrivateSaleVestor.address+" ]]]]]");
        console.log("[[[[[Private Crowd Sale Address: "  + RUNPrivateSale.address+" ]]]]]");

        //TRANSFER 250 MIL TOKENS TO PRIVATE SALE CONTRACT
        var tokenAddress = RunToken.address;
        var transferAmount = 250000000 * Math.pow(10,18);
        var runToken = RunToken.at(tokenAddress);

        runToken.transfer(RUNPrivateSale.address, transferAmount).then(res => {
          if(res){
            console.log("Transfer complete!")
          } else {
            console.log("Transfer failed")
          }
        }).catch(err=>{
          console.log(err);
        });

      });

};
