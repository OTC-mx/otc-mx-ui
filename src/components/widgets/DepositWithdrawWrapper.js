import React from 'react';

import Deposit from './Deposit';
import Withdraw from './Withdraw';
import { not_a_party } from './NoOp';

function DepositWithdrawWrapper(web3, accounts, portfolioAddress, portfolio, portfolioInfo, setPortfolioInfo) {

  function choose_widget() {
    let address_lower = `${accounts[0]}`.trim().toLowerCase();
    let owner_lower = `${portfolioInfo[2]}`.trim().toLowerCase();

    if (address_lower == owner_lower) {
      return([
        Withdraw(web3, accounts, portfolioAddress, portfolio, portfolioInfo, setPortfolioInfo),
        Deposit(web3, accounts, portfolioAddress, portfolio, portfolioInfo, setPortfolioInfo)
      ]);
    } else {
      return([not_a_party(), '']);
    }
  };
  let widgets = choose_widget();
  console.log(widgets);

  return(
    <div>
      <div> {widgets[0]} </div>
      <div> {widgets[1]} </div>
    </div>
  );
}

export default DepositWithdrawWrapper;
