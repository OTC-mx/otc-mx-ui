import React from 'react';

import PayFee from './PayFee';
import Activate from './Activate';
import Expire from './Expire';
import Nonparticipant from './Nonparticipant';

function PayFeeActivateAbort(web3, derivative, derivative_address, accounts,
    state_mappings, derivativeInfo, setDerivativeInfo, forward = true) {

  function choose_widget() {
    let current_time = Math.floor(Date.now() / 1000);
    let address_lower = `${accounts[0]}`.trim().toLowerCase();
    let issuer_lower = `${derivativeInfo[0]}`.trim().toLowerCase();
    let buyer_lower = `${derivativeInfo[1]}`.trim().toLowerCase();

    if (address_lower == buyer_lower) {
      if (forward) {
        return(Activate(web3, derivative, derivative_address, accounts, state_mappings, derivativeInfo, setDerivativeInfo));
      } else {
        return(PayFee(web3, derivative, derivative_address, accounts, state_mappings, derivativeInfo, setDerivativeInfo));
      }
    } else if (address_lower == issuer_lower) {
      return(Expire(web3, derivative, derivative_address, accounts, state_mappings, derivativeInfo, setDerivativeInfo,
                    "Abort"));
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
