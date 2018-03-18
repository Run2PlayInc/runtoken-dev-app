import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Web3Service } from './web3.service'

const runtokenArtifacts = require('../../build/contracts/RunToken.json');
const contract = require('truffle-contract');

@Injectable()
export class RunTokenService {

	RunToken = contract(runtokenArtifacts);

  constructor(
  	private web3Ser: Web3Service,
  	) {
  	// Bootstrap the MetaCoin abstraction for Use
  	this.RunToken.setProvider(web3Ser.web3.currentProvider);
  }

  getBalance(account): Observable<number> {
  	let run;

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
  		    observer.next(value)
  		    observer.complete()
  		  })
  		  .catch(e => {
  		    console.log(e);
  		    observer.error(e)
  		  });
  	})
  }

  sendToken(from, to, amount): Observable<any>{
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

}
