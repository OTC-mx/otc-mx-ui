import React, { useState, useEffect } from 'react';
import { Formik, Field } from 'formik';
import Web3 from 'web3';

import CustomInputComponent from '../../utils/FormikUtils';
import { state_mappings } from '../../utils/StateMappings';
import SilentOption from '../../atomic-options/build/contracts/SilentOption';

import MetaMaskNotFound from '../widgets/MetaMaskNotFound';
import ContractNotInitialized from '../widgets/ContractNotInitialized';
import PayFeeActivateAbort from '../widgets/PayFeeActivateAbort';
import ExerciseExpire from '../widgets/ExerciseExpire';
import ContractExpired from '../widgets/ContractExpired';

function OperateCall() {
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState({});
  const [silentOptionAddress, setSilentOptionAddress] = useState({});
  const [silentOption, setSilentOption] = useState({});
  const [silentOptionInfo, setSilentOptionInfo] = useState([]);

  useEffect(() => {
    (function () {
      (async function () {
        if (typeof window.ethereum == 'undefined'){ return; }
        let accounts_temp = await window.ethereum.enable();
        let web3_temp = new Web3(window.ethereum);
        let silent_option_address_temp = window.location.pathname.split("/").filter((e) => e !== "").pop();

        let silent_option_temp = new web3_temp.eth.Contract(SilentOption.abi, silent_option_address_temp);

        let silent_option_info_call = await (
          silent_option_temp
          .methods
          .get_info()
          .call({ from: accounts_temp[0] }, (error, result) => console.log(result) ));

        setAccounts(accounts_temp);
        setWeb3(web3_temp);
        setSilentOptionAddress(silent_option_address_temp);
        setSilentOption(silent_option_temp);
        setSilentOptionInfo(silent_option_info_call);
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
          '0': ContractNotInitialized(),
          '1': ContractNotInitialized(),
          '2': PayFeeActivateAbort(web3, silentOption, silentOptionAddress, accounts,
             state_mappings, silentOptionInfo, setSilentOptionInfo),
          '3': ExerciseExpire(web3, silentOption, silentOptionAddress, accounts,
             state_mappings, silentOptionInfo, setSilentOptionInfo),
          '4': ExerciseExpire(web3, silentOption, silentOptionAddress, accounts,
             state_mappings, silentOptionInfo, setSilentOptionInfo),
          '5': ContractExpired()
        }[contract_state]
      );
    }

    return (
      <div>
        <h1>Operate Silent Call Option</h1>
        <h2>About this Option</h2>
        <table>
          <tbody>
            <tr>
              <th>Contract Address</th>
              <th>{silentOptionAddress.toString()}</th>
            </tr>
            <tr>
              <th>Issuer Address</th>
              <th>{silentOptionInfo[0]}</th>
            </tr>
            <tr>
              <th>Buyer Address</th>
              <th>{silentOptionInfo[1]}</th>
            </tr>
            <tr>
              <th>Base Token Address</th>
              <th>{silentOptionInfo[2]}</th>
            </tr>
            <tr>
              <th>Asset Address</th>
              <th>{silentOptionInfo[3]}</th>
            </tr>
            <tr>
              <th>Fee (smallest unit Base Token)</th>
              <th>{silentOptionInfo[4]}</th>
            </tr>
            <tr>
              <th>Base Strike Price Hash / Quote Strike Price Hash</th>
              <th>{silentOptionInfo[5]} / {silentOptionInfo[6]}</th>
            </tr>
            <tr>
              <th>Volume (smallest unit Asset)</th>
              <th>{silentOptionInfo[7]}</th>
            </tr>
            <tr>
              <th>Maturity Time (Unix)</th>
              <th>{silentOptionInfo[8]}</th>
            </tr>
            <tr>
              <th>Expiry Time (Unix)</th>
              <th>{silentOptionInfo[9]}</th>
            </tr>
            <tr>
              <th>State</th>
              <th>{state_mappings[silentOptionInfo[10]]}</th>
            </tr>
          </tbody>
        </table>
        <div>{operate_display(silentOptionInfo[10])}</div>
      </div>
    );
  }
}

export default OperateCall;
