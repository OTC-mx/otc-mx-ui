import React from 'react';

import PayFee from './PayFee';
import ExpireAbort from './ExpireAbort'
import Nonparticipant from './Nonparticipant'

function PayFeeNoAction(web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo) {

  function choose_widget() {
    let current_time = Math.floor(Date.now() / 1000);
    let address_lower = `${accounts[0]}`.trim().toLowerCase();
    let issuer_lower = `${optionInfo[0]}`.trim().toLowerCase();
    let buyer_lower = `${optionInfo[1]}`.trim().toLowerCase();

    if (address_lower == buyer_lower) {
      return(PayFee(web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo));
    } else if (address_lower == issuer_lower) {
      return(ExpireAbort(web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo));
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

export default PayFeeNoAction;
