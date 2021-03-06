import React, { useState, useEffect } from 'react';

import { state_mappings } from '../../utils/StateMappings';
import { set_web3 } from '../../utils/EthereumUtils';
import Forward from '../../atomic-options/build/contracts/Forward';

import { contract_not_initialized, contract_expired } from '../widgets/NoOp';
import PayFeeActivateAbort from '../widgets/PayFeeActivateAbort';
import SettleWrapper from '../widgets/SettleWrapper';

function OperateForward() {
  const [accounts, setAccounts] = useState([]);
  const [forwardAddress, setForwardAddress] = useState({});
  const [forward, setForward] = useState({});
  const [forwardInfo, setForwardInfo] = useState([]);
  let [web3, web3_message] = set_web3(window, setAccounts);

  useEffect(() => {
    (function () {
      (async function () {
        if (typeof window.ethereum == 'undefined'){ return; }
        let forward_address_temp = window.location.pathname.split("/").filter((e) => e !== "").pop();

        let forward_temp = new web3.eth.Contract(Forward.abi, forward_address_temp);

        let forward_info_call = await (
          forward_temp
          .methods
          .get_info()
          .call({ from: accounts[0] }, (error, result) => console.log(result) ));

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
        <div>{web3_message}</div>
      </div>
    );
  } else {
    function operate_display(contract_state) {
      return (
        {
          '0': contract_not_initialized(),
          '1': contract_not_initialized(),
          '2': PayFeeActivateAbort(web3, forward, forwardAddress, accounts,
             forwardInfo, setForwardInfo, true),
          '3': SettleWrapper(web3, forward, forwardAddress, accounts,
             forwardInfo, setForwardInfo),
          '4': SettleWrapper(web3, forward, forwardAddress, accounts,
             forwardInfo, setForwardInfo),
          '5': contract_expired()
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
              <th>Contract Address</th>
              <th>{forwardAddress.toString()}</th>
            </tr>
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
