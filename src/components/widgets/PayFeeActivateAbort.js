import React from 'react';

import ActivateManaged from './ActivateManaged';
import { pay_fee, expire, activate } from './SingleButtonWrappers';
import { not_a_party } from './NoOp';

function PayFeeActivateAbort(web3, derivative, derivative_address, accounts,
    derivativeInfo, setDerivativeInfo,
    forward = false, managed_forward = false, portfolioInfo = 0, setPortfolioInfo = 0) {

  function choose_widget() {
    let address_lower = `${accounts[0]}`.trim().toLowerCase();
    let issuer_lower = `${derivativeInfo[0]}`.trim().toLowerCase();
    let buyer_lower = `${derivativeInfo[1]}`.trim().toLowerCase();

    if (address_lower == buyer_lower) {
      if (forward) {
        return(activate(web3, derivative, derivative_address,
                        accounts, derivativeInfo, setDerivativeInfo));
      } else if (managed_forward) {
        return(ActivateManaged(web3, derivative, derivative_address, accounts,
          derivativeInfo, setDerivativeInfo, portfolioInfo, setPortfolioInfo));
      } else {
        return(pay_fee(web3, derivative, derivative_address,
                        accounts, derivativeInfo, setDerivativeInfo));
      }
    } else if (address_lower == issuer_lower) {
      return(expire(web3, derivative, derivative_address,
                    accounts, derivativeInfo, setDerivativeInfo,
                    "Abort"));
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

export default PayFeeActivateAbort;
