import React from 'react';
import { Formik, Field } from 'formik';

import SingleButtonAction from './SingleButtonAction';

import ERC20 from '../../atomic-options/build/contracts/ERC20';

function pay_fee(web3, option, option_address, accounts,
                  optionInfo, setOptionInfo) {
  if (! optionInfo[2]){ return ''; }
  let base = new web3.eth.Contract(ERC20.abi, optionInfo[2]);
  let approve_method = base.methods.approve(option_address, optionInfo[4]);
  let pay_fee_method = option.methods.pay_fee()
  return(SingleButtonAction(web3, option, option_address, accounts,
                            optionInfo, setOptionInfo,
                            "Pay Fee for", "Pay Fee",
                            pay_fee_method,
                            true, approve_method));
}

function expire(web3, derivative, derivative_address, accounts,
                derivativeInfo, setDerivativeInfo,
                title_str,
                is_tokenized,
                tokenInfo, setTokenInfo) {
  let expire_method = derivative.methods.expire();
  let token_info_method = (is_tokenized ? derivative.methods.get_token_info() : 0);

  return(SingleButtonAction(web3, derivative, derivative_address, accounts,
                            derivativeInfo, setDerivativeInfo,
                            title_str, title_str,
                            expire_method,
                            false, 0,
                            is_tokenized,
                            token_info_method,
                            tokenInfo, setTokenInfo));
}

function activate(web3, forward, forward_address, accounts,
                  forwardInfo, setForwardInfo) {
  if (! forwardInfo[2]){ return ''; }
  let base = new web3.eth.Contract(ERC20.abi, forwardInfo[2]);
  let approve_method = base.methods.approve(forward_address, forwardInfo[7])
  let activate_method = forward.methods.activate();
  let forward_info_method = forward.methods.get_info();
  return(SingleButtonAction(web3, forward, forward_address, accounts,
                            forwardInfo, setForwardInfo,
                            "Activate", "Activate",
                            activate_method,
                            true, approve_method));
}

function settle(web3, forward, forward_address, accounts, forwardInfo, setForwardInfo,
                is_managed, portfolioInfo, setPortfolioInfo) {
  let settle_method = forward.methods.settle();
  let portfolio_info_method = (is_managed ? forward.methods.get_portfolio_info(): 0);

  return(SingleButtonAction(web3, forward, forward_address, accounts,
                            forwardInfo, setForwardInfo,
                            "Settle", "Settle",
                            settle_method,
                            false, 0,
                            is_managed,
                            portfolio_info_method,
                            portfolioInfo, setPortfolioInfo));
}

function force_settle(web3, forward, forward_address, accounts,
                      forwardInfo, setForwardInfo, portfolioInfo, setPortfolioInfo) {
  let force_settle_method = forward.methods.force_settle();
  let portfolio_info_method = forward.methods.get_portfolio_info();

  return(SingleButtonAction(web3, forward, forward_address, accounts,
                            forwardInfo, setForwardInfo,
                            "Recursively Settle", "Settle",
                            force_settle_method,
                            false, 0,
                            true,
                            portfolio_info_method,
                            portfolioInfo, setPortfolioInfo));
}

export {pay_fee, expire, activate, settle, force_settle};
