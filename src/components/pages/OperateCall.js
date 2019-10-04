import React, { useState, useEffect } from 'react';
import { Formik, Field } from 'formik';
import Web3 from 'web3';

import CustomInputComponent from '../../utils/FormikUtils';
import { state_mappings } from '../../utils/StateMappings';
import Option from '../../atomicoptions/build/contracts/option';

import MetaMaskNotFound from '../widgets/MetaMaskNotFound';
import OptionNotInitialized from '../widgets/OptionNotInitialized';
import PayFee from '../widgets/PayFee';
import ExerciseExpire from '../widgets/ExerciseExpire';

function OperateCall() {
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState({});
  const [optionAddress, setOptionAddress] = useState({});
  const [option, setOption] = useState({});
  const [optionInfo, setOptionInfo] = useState([]);

  useEffect(() => {
    (function () {
      (async function () {
        if (typeof window.ethereum == 'undefined'){ return; }
        let accounts_temp = await window.ethereum.enable();
        let web3_temp = new Web3(window.ethereum);
        let option_address_temp = window.location.pathname.split("/").filter((e) => e !== "").pop();

        let option_temp = new web3_temp.eth.Contract(Option.abi, option_address_temp);

        let option_info_call = await (
          option_temp
          .methods
          .get_info()
          .call({ from: accounts_temp[0] }, (error, result) => console.log(result) ));

        setAccounts(accounts_temp);
        setWeb3(web3_temp);
        setOptionAddress(option_address_temp);
        setOption(option_temp);
        setOptionInfo(option_info_call);
      })();
    })();
  }, []);
  if (typeof window.ethereum == 'undefined'){
    return(
      <div>
        <h1>Operate Call Option</h1>
        <div>{MetaMaskNotFound()}</div>
      </div>
    );
  } else {
    function operate_display(contract_state) {
      return (
        {
          // '0': OptionNotInitialized(),
          '0': ExerciseExpire(web3, option, optionAddress, accounts,
             state_mappings, optionInfo, setOptionInfo),
          '1': OptionNotInitialized(),
          '2': PayFee(web3, option, optionAddress, accounts,
             state_mappings, optionInfo, setOptionInfo),
          '3': ExerciseExpire(web3, option, optionAddress, accounts,
             state_mappings, optionInfo, setOptionInfo),
          '4': ExerciseExpire(web3, option, optionAddress, accounts,
             state_mappings, optionInfo, setOptionInfo),
          // '5': ContractExpired()
        }[contract_state]
      );
    }

    return (
      <div>
        <h1>Operate Call Option</h1>
        <h2>About this Option</h2>
        <table>
          <tbody>
            <tr>
              <th>Issuer Address</th>
              <th>{optionInfo[0]}</th>
            </tr>
            <tr>
              <th>Buyer Address</th>
              <th>{optionInfo[1]}</th>
            </tr>
            <tr>
              <th>Base Token Address</th>
              <th>{optionInfo[2]}</th>
            </tr>
            <tr>
              <th>Asset Address</th>
              <th>{optionInfo[3]}</th>
            </tr>
            <tr>
              <th>Fee (smallest unit Base Token)</th>
              <th>{optionInfo[4]}</th>
            </tr>
            <tr>
              <th>Base Strike Price / Quote Strike Price</th>
              <th>{optionInfo[5]} / {optionInfo[6]}</th>
            </tr>
            <tr>
              <th>Volume (smallest unit Asset)</th>
              <th>{optionInfo[7]}</th>
            </tr>
            <tr>
              <th>Maturity Time</th>
              <th>{optionInfo[8]}</th>
            </tr>
            <tr>
              <th>Expiry Time</th>
              <th>{optionInfo[9]}</th>
            </tr>
            <tr>
              <th>State</th>
              <th>{state_mappings[optionInfo[10]]}</th>
            </tr>
          </tbody>
        </table>
        <div>{operate_display(optionInfo[10])}</div>
      </div>
    );
  }
}

export default OperateCall;
