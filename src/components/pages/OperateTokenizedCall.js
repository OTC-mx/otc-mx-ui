import React, { useState, useEffect } from 'react';

import { state_mappings } from '../../utils/StateMappings';
import { set_web3 } from '../../utils/EthereumUtils';
import TokenizedOption from '../../atomic-options/build/contracts/TokenizedOption';

import { contract_not_initialized, contract_expired } from '../widgets/NoOp';
import PayFeeActivateAbort from '../widgets/PayFeeActivateAbort';
import ExerciseExpire from '../widgets/ExerciseExpire';

function OperateTokenizedCall() {
  const [accounts, setAccounts] = useState([]);
  const [optionAddress, setOptionAddress] = useState({});
  const [option, setOption] = useState({});
  const [optionInfo, setOptionInfo] = useState([]);
  const [tokenInfo, setTokenInfo] = useState([]);
  let [web3, web3_message] = set_web3(window, setAccounts);

  useEffect(() => {
    (function () {
      (async function () {
        if (typeof window.ethereum == 'undefined'){ return; }
        let option_address_temp = window.location.pathname.split("/").filter((e) => e !== "").pop();

        let option_temp = new web3.eth.Contract(TokenizedOption.abi, option_address_temp);

        let option_info_call = await (
          option_temp
          .methods
          .get_info()
          .call({ from: accounts[0] }, (error, result) => console.log(result) ));
        let token_info_call = await (
          option_temp
          .methods
          .get_token_info()
          .call({ from: accounts[0] }, (error, result) => console.log(result) ));
        let asset_exercisable = (web3.utils.toBN(token_info_call[4])
          .mul(web3.utils.toBN(option_info_call[6]))
          .div(web3.utils.toBN(option_info_call[5]))
        );
        token_info_call[6] = asset_exercisable.toString();

        setOptionAddress(option_address_temp);
        setOption(option_temp);
        setOptionInfo(option_info_call);
        setTokenInfo(token_info_call);
      })();
    })();
  }, []);
  if (typeof window.ethereum == 'undefined'){
    return(
      <div>
        <h1>Operate Tokenized Call Option</h1>
        <div>{web3_message}</div>
      </div>
    );
  } else {
    function operate_display(contract_state) {
      return (
        {
          '0': contract_not_initialized(),
          '1': contract_not_initialized(),
          '2': PayFeeActivateAbort(web3, option, optionAddress, accounts,
             optionInfo, setOptionInfo),
          '3': ExerciseExpire(web3, option, optionAddress, accounts,
             optionInfo, setOptionInfo, true,
             tokenInfo, setTokenInfo),
          '4': ExerciseExpire(web3, option, optionAddress, accounts,
             optionInfo, setOptionInfo, true,
             tokenInfo, setTokenInfo),
          '5': contract_expired()
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
              <th>Contract Address</th>
              <th>{optionAddress.toString()}</th>
            </tr>
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
              <th>Maturity Time (Unix)</th>
              <th>{optionInfo[8]}</th>
            </tr>
            <tr>
              <th>Expiry Time (Unix)</th>
              <th>{optionInfo[9]}</th>
            </tr>
            <tr>
              <th>State</th>
              <th>{state_mappings[optionInfo[10]]}</th>
            </tr>
          </tbody>
        </table>
        <table>
          <tbody>
            <tr>
              <th>Option Claim Token Address</th>
              <th>{tokenInfo[0]}</th>
            </tr>
            <tr>
              <th>Collateral Claim Token Address</th>
              <th>{tokenInfo[1]}</th>
            </tr>
            <tr>
              <th>Option Claim Token Supply</th>
              <th>{tokenInfo[2]}</th>
            </tr>
            <tr>
              <th>Collateral Claim Token Supply</th>
              <th>{tokenInfo[3]}</th>
            </tr>
            <tr>
              <th>Your Option Claim Token Balance</th>
              <th>{tokenInfo[4]}</th>
            </tr>
            <tr>
              <th>Your Collateral Claim Token Balance</th>
              <th>{tokenInfo[5]}</th>
            </tr>
            <tr>
              <th>Amount of Asset you can Buy if Active</th>
              <th>{tokenInfo[6]}</th>
            </tr>
          </tbody>
        </table>
        <div>{operate_display(optionInfo[10])}</div>
      </div>
    );
  }
}

export default OperateTokenizedCall;
