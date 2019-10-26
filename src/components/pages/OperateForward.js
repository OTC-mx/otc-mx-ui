import React, { useState, useEffect } from 'react';
import { Formik, Field } from 'formik';
import Web3 from 'web3';

import CustomInputComponent from '../../utils/FormikUtils';
import { state_mappings } from '../../utils/StateMappings';
import Forward from '../../atomic-options/build/contracts/Forward';

import MetaMaskNotFound from '../widgets/MetaMaskNotFound';
import ContractNotInitialized from '../widgets/ContractNotInitialized';
import PayFeeActivateAbort from '../widgets/PayFeeActivateAbort';
import SettleNoAction from '../widgets/SettleNoAction';
import ContractExpired from '../widgets/ContractExpired';

function OperateForward() {
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState({});
  const [forwardAddress, setForwardAddress] = useState({});
  const [forward, setForward] = useState({});
  const [forwardInfo, setForwardInfo] = useState([]);

  useEffect(() => {
    (function () {
      (async function () {
        if (typeof window.ethereum == 'undefined'){ return; }
        let accounts_temp = await window.ethereum.enable();
        let web3_temp = new Web3(window.ethereum);
        let forward_address_temp = window.location.pathname.split("/").filter((e) => e !== "").pop();

        let forward_temp = new web3_temp.eth.Contract(Forward.abi, forward_address_temp);

        let forward_info_call = await (
          forward_temp
          .methods
          .get_info()
          .call({ from: accounts_temp[0] }, (error, result) => console.log(result) ));

        setAccounts(accounts_temp);
        setWeb3(web3_temp);
        setForwardAddress(forward_address_temp);
        setForward(forward_temp);
        setForwardInfo(forward_info_call);
      })();
    })();
  }, []);
  if (typeof window.ethereum == 'undefined'){
    return(
      <div>
        <h1>Operate Forward</h1>
        <div>{MetaMaskNotFound()}</div>
      </div>
    );
  } else {
    function operate_display(contract_state) {
      return (
        {
          '0': ContractNotInitialized(),
          '1': ContractNotInitialized(),
          '2': PayFeeActivateAbort(web3, forward, forwardAddress, accounts,
             state_mappings, forwardInfo, setForwardInfo, true),
          '3': SettleNoAction(web3, forward, forwardAddress, accounts,
             state_mappings, forwardInfo, setForwardInfo),
          '4': SettleNoAction(web3, forward, forwardAddress, accounts,
             state_mappings, forwardInfo, setForwardInfo),
          '5': ContractExpired()
        }[contract_state]
      );
    }

    return (
      <div>
        <h1>Operate Forward</h1>
        <h2>About this Forward</h2>
        <table>
          <tbody>
            <tr>
              <th>Issuer Address</th>
              <th>{forwardInfo[0]}</th>
            </tr>
            <tr>
              <th>Buyer Address</th>
              <th>{forwardInfo[1]}</th>
            </tr>
            <tr>
              <th>Base Token Address</th>
              <th>{forwardInfo[2]}</th>
            </tr>
            <tr>
              <th>Asset Address</th>
              <th>{forwardInfo[3]}</th>
            </tr>
            <tr>
              <th>Base Strike Price / Quote Strike Price</th>
              <th>{forwardInfo[4]} / {forwardInfo[5]}</th>
            </tr>
            <tr>
              <th>Volume (smallest unit Asset)</th>
              <th>{forwardInfo[6]}</th>
            </tr>
            <tr>
              <th>Base Volume (smallest unit Base)</th>
              <th>{forwardInfo[7]}</th>
            </tr>
            <tr>
              <th>Maturity Time (Unix)</th>
              <th>{forwardInfo[8]}</th>
            </tr>
            <tr>
              <th>State</th>
              <th>{state_mappings[forwardInfo[9]]}</th>
            </tr>
          </tbody>
        </table>
        <div>{operate_display(forwardInfo[9])}</div>
      </div>
    );
  }
}

export default OperateForward;