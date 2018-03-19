import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {Web3Service} from './web3.service'

const runtokenArtifacts = require('../../build/contracts/RunToken.json');
const privateSaleVester = require('../../build/contracts/PrivateSaleVester.json');
const contract = require('truffle-contract');

@Injectable()
export class RunTokenService {

  tokenAddress = '0x7407b62e558520ebe69e831761e3bebfa1460e43';
  privateCrowdSaleAddress = '0x3dbe65963fea3440bc0099cdad8ba12e446aecd2';

  RunToken = contract(runtokenArtifacts);
  PrivateSaleVester = contract(privateSaleVester);

  constructor(private web3Ser: Web3Service) {
    // Bootstrap the MetaCoin abstraction for Use
    this.RunToken.setProvider(web3Ser.web3.currentProvider);
    this.PrivateSaleVester.setProvider(web3Ser.web3.currentProvider);
  }

  getBalance(account): Observable<number> {
    let run;
    console.log('getBalance');

    return Observable.create(observer => {
      this.RunToken
        .deployed()
        .then(instance => {
          run = instance;
          //we use call here so the call doesn't try and write, making it free
          return run.balanceOf.call(account, {
            from: account
          });
        })
        .then(value => {
          observer.next(value/1e18)
          observer.complete()
        })
        .catch(e => {
          console.log(e);
          observer.error(e)
        });
    })
  }

  sendCoin(from, to, amount): Observable<any> {
    let run;

    return Observable.create(observer => {
      this.RunToken
        .deployed()
        .then(instance => {
          run = instance;
          return run.transfer(to, amount, {
            from: from
          });
        })
        .then(() => {
          observer.next()
          observer.next()
        })
        .catch(e => {
          console.log(e);
          observer.error(e)
        });
    })
  }

  releaseGrant(from): Observable<any> {
    let vester;

    return Observable.create(observer => {
      this.PrivateSaleVester
        .deployed()
        .then(instance => {
          vester = instance;
          return vester.releaseGrant(this.tokenAddress, this.privateCrowdSaleAddress, true, {
            from: from
          });
        })
        .then(() => {
          observer.next()
          observer.complete()
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        })
    })
  }

  getUnreleasedBalance(from): Observable<any> {
    let vester;

    return Observable.create(observer => {
      this.PrivateSaleVester
        .deployed()
        .then(instance => {
          vester = instance;
          return vester.getBalanceVesting(this.tokenAddress, this.privateCrowdSaleAddress, from,{
            from: from
          });
        })
        .then(value => {
          observer.next(value/1e18)
          observer.complete()
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        })
    })
  }

  getTotalRunBalance(from): Observable<any> {
    let vester;

    return Observable.create(observer => {
      this.PrivateSaleVester
        .deployed()
        .then(instance => {
          vester = instance;
          return vester.getBalance(this.tokenAddress, from, {
            from: from
          });
        })
        .then(value => {
          observer.next(value/1e18)
          observer.complete()
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        })
    })
  }


}
