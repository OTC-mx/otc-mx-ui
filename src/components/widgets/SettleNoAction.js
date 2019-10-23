import React from 'react';

import PayFee from './PayFee';
import Settle from './Settle';
import NoAction from "./NoAction";
import Nonparticipant from './Nonparticipant';

function PayFeeActivateAbort(web3, forward, forwardAddress, accounts,
   state_mappings, forwardInfo, setForwardInfo) {

  function choose_widget() {
    let current_time = Math.floor(Date.now() / 1000);
    let address_lower = `${accounts[0]}`.trim().toLowerCase();
    let issuer_lower = `${forwardInfo[0]}`.trim().toLowerCase();
    let buyer_lower = `${forwardInfo[1]}`.trim().toLowerCase();

    if ((address_lower == buyer_lower) || (address_lower == issuer_lower)) {
      if (current_time > forwardInfo[8]) {
        return(Settle(web3, forward, forwardAddress, accounts,
           state_mappings, forwardInfo, setForwardInfo));
      } else {
        return(NoAction());
      }
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
