import React from 'react';

import PayFee from './PayFee';
import NoAction from './NoAction'
import Nonparticipant from './Nonparticipant'

function PayFeeNoAction(web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo) {

  function choose_widget() {
    let current_time = Math.floor(Date.now() / 1000);
    if (accounts[0] == optionInfo[1]) {
      return(PayFee(web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo));
    } else if (accounts[0] == optionInfo[0]) {
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

export default PayFeeNoAction;
