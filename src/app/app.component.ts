import { Component, HostListener, NgZone } from '@angular/core';

import {Web3Service, RunTokenService} from '../services/services'

import { canBeNumber } from '../util/validation';

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  // TODO add proper types these variables
  account: any;
  accounts: any;

  balance: number;
  unreleasedBalance: number;
  ethBalance: number;
  sendingAmount: number;
  recipientAddress: string;
  status: string;
  canBeNumber = canBeNumber;

  constructor(
    private _ngZone: NgZone,
    private web3Service: Web3Service,
    private runTokenService: RunTokenService,
    ) {
    this.balance = 0;
    this.ethBalance = 0;
    this.unreleasedBalance = 0;
    this.onReady();
  }

  onReady = () => {

    // Get the initial account balance so it can be displayed.
    this.web3Service.getAccounts().subscribe(accs => {
      this.accounts = accs;
      this.account = this.accounts[0];

      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution
      this._ngZone.run(() =>
        this.refreshBalance()
      );
    }, err => alert(err));
  };

  refreshBalance = () => {
    // Get RUNtoken balance
    this.runTokenService.getBalance(this.account)
      .subscribe(value => {
        this.balance = value
      }, e => {this.setStatus('Error getting balance; see log.')});

    // Get Unreleased Balance
    this.runTokenService.getUnreleasedBalance(this.account)
      .subscribe(value => {
        console.log('unreleased balance: ' + value);
        this.unreleasedBalance = value
      }, e => {this.setStatus('Error getting unreleased balance; see log')});

    // Get ETH Balance
    this.web3Service.getBalance(this.account)
      .subscribe(value => {
        this.ethBalance = value
      }, e => {this.setStatus('Error getting ETH balance; see log.')});

  };

  setStatus = message => {
    this.status = message;
  };

  sendCoin = () => {
    this.setStatus('Initiating transaction... (please wait)');

    this.runTokenService.sendCoin(this.account, this.recipientAddress, this.sendingAmount)
      .subscribe(() => {
        this.setStatus('Transaction complete!');
        this.refreshBalance();
      }, e => this.setStatus('Error sending coin; see log.'))
  };

  releaseGrant = () => {
    this.setStatus('Releasing grant... (please wait)');

    this.runTokenService.releaseGrant(this.account)
      .subscribe(() => {
        this.setStatus('Release complete!');
        this.refreshBalance();
      }, e => this.setStatus('Error releasing grant; see log.'))
  }
}
