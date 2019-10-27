import React from 'react';

import PayFee from './PayFee';
import Settle from './Settle';
import ForceSettle from './ForceSettle';
import NoAction from "./NoAction";
import Nonparticipant from './Nonparticipant';
import { state_mappings } from '../../utils/StateMappings';

function PayFeeActivateAbort(web3, forward, forwardAddress, accounts,
   state_mappings, forwardInfo, setForwardInfo,
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
      return(ForceSettle(web3, forward, forwardAddress, accounts,
        state_mappings, forwardInfo, setForwardInfo, portfolioInfo, setPortfolioInfo));
    } else if (managed_settlable || non_managed_settlable) {
      return(Settle(web3, forward, forwardAddress, accounts,
         state_mappings, forwardInfo, setForwardInfo,
         is_managed, portfolioInfo, setPortfolioInfo));
    } else if (is_participant) {
      return(NoAction());
    } else {
      return(Nonparticipant());
    }
  };

  return(
    <div>
      {choose_widget()}
    </div>
  );
}

export default PayFeeActivateAbort;
