import React from 'react';

import PortfolioAction from './PortfolioAction';

import ERC20 from '../../atomic-options/build/contracts/ERC20';

function deposit(web3, accounts, portfolioAddress, portfolio,
                  portfolioInfo, setPortfolioInfo) {
  if (! portfolio.methods){ return ''; }
  let deposit_method = portfolio.methods.deposit;
  return(PortfolioAction(web3, accounts, portfolioAddress, portfolio,
                          portfolioInfo, setPortfolioInfo,
                          "Deposit Funds to", "Deposit",
                          deposit_method,
                          true));
}

function withdraw(web3, accounts, portfolioAddress, portfolio,
                  portfolioInfo, setPortfolioInfo) {
  if (! portfolio.methods){ return ''; }
  let withdraw_method = portfolio.methods.withdraw;
  return(PortfolioAction(web3, accounts, portfolioAddress, portfolio,
                          portfolioInfo, setPortfolioInfo,
                          "Withdraw Funds from", "Withdraw",
                          withdraw_method));
}

export { deposit, withdraw };
