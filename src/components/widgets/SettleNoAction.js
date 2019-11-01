import React from 'react';

import { no_action, not_a_party } from './NoOp';
import { settle, force_settle } from './SingleButtonWrappers';

function SettleNoAction(web3, forward, forwardAddress, accounts,
   forwardInfo, setForwardInfo,
   is_managed = false, portfolioInfo = [0] * 6, setPortfolioInfo = 0,
   isForceSettle = false) {

  function choose_widget() {
    let current_time = Math.floor(Date.now() / 1000);
    let address_lower = `${accounts[0]}`.trim().toLowerCase();
    let issuer_lower = `${forwardInfo[0]}`.trim().toLowerCase();
    let buyer_lower = `${forwardInfo[1]}`.trim().toLowerCase();

    let is_participant = ((address_lower == buyer_lower) || (address_lower == issuer_lower));
    let non_managed_settlable = ((! is_managed) &&
                                  (current_time > forwardInfo[8]) &&
                                  is_participant);
    let managed_settlable = ((is_managed) && (current_time > forwardInfo[8]));

    if (managed_settlable && isForceSettle) {
      return(force_settle(web3, forward, forwardAddress, accounts,
                          forwardInfo, setForwardInfo,
                          portfolioInfo, setPortfolioInfo));
    } else if (managed_settlable || non_managed_settlable) {
      return(settle(web3, forward, forwardAddress, accounts,
                    forwardInfo, setForwardInfo,
                    is_managed, portfolioInfo, setPortfolioInfo));
    } else if (is_participant) {
      return(no_action());
    } else {
      return(not_a_party());
    }
  };

  return(
    <div>
      {choose_widget()}
    </div>
  );
}

export default SettleNoAction;
