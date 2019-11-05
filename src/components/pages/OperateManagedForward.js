import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { ethers } from 'ethers';

import { state_mappings } from '../../utils/StateMappings';
import { set_web3 } from '../../utils/EthereumUtils';
import ManagedForward from '../../atomic-options/build/contracts/ManagedForward';

import { contract_not_initialized, contract_expired } from '../widgets/NoOp';
import PayFeeActivateAbort from '../widgets/PayFeeActivateAbort';
import SettleWrapper from '../widgets/SettleWrapper';

function OperateManagedForward() {
  const [accounts, setAccounts] = useState([]);
  const [forwardAddress, setForwardAddress] = useState({});
  const [forward, setForward] = useState({});
  const [forwardInfo, setForwardInfo] = useState([]);
  const [portfolioInfo, setPortfolioInfo] = useState([]);
  const [isForceSettle, setIsForceSettle] = useState('');
  let [web3, web3_message] = set_web3(window, setAccounts);

  useEffect(() => {
    (function () {
      (async function () {
        if (typeof window.ethereum == 'undefined'){ return; }
        let forward_address_temp = window.location.pathname.split("/").filter((e) => e !== "").pop();

        let forward_temp = new web3.eth.Contract(ManagedForward.abi, forward_address_temp);

        let forward_info_call = await (
          forward_temp
          .methods
          .get_info()
          .call({ from: accounts[0] }, (error, result) => console.log(result) ));
        let portfolio_info_call = await (
          forward_temp
          .methods
          .get_portfolio_info()
          .call({ from: accounts[0] }, (error, result) => console.log(result) ));

        let zero_address = ethers.utils.hexZeroPad('0x0', 20);
        let base_matched_state_call;
        if (portfolio_info_call[4] == zero_address) {
          base_matched_state_call = state_mappings.expired;
        } else {
          let base_matched = new web3.eth.Contract(ManagedForward.abi, portfolio_info_call[4]);
          base_matched_state_call = await (
            base_matched
            .methods
            .state()
            .call({ from: accounts[0] }, (error, result) => console.log(result) ));
        }
        let asset_matched_state_call;
        if (portfolio_info_call[5] == zero_address) {
          asset_matched_state_call = state_mappings.expired;
        } else {
          let asset_matched = new web3.eth.Contract(ManagedForward.abi, portfolio_info_call[5]);
          asset_matched_state_call = await (
            asset_matched
            .methods
            .state()
            .call({ from: accounts[0] }, (error, result) => console.log(result) ));
        }

        let is_force_settle_temp = (! ((base_matched_state_call == state_mappings.expired) &&
                                    (asset_matched_state_call == state_mappings.expired)));

        setForwardAddress(forward_address_temp);
        setForward(forward_temp);
        setForwardInfo(forward_info_call);
        setPortfolioInfo(portfolio_info_call);
        setIsForceSettle(is_force_settle_temp);
      })();
    })();
  }, []);
  if (typeof window.ethereum == 'undefined'){
    return(
      <div>
        <h1>Operate Managed Forward</h1>
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
             forwardInfo, setForwardInfo, false, true,
             portfolioInfo, setPortfolioInfo),
          '3': SettleWrapper(web3, forward, forwardAddress, accounts,
             forwardInfo, setForwardInfo,
             true, portfolioInfo, setPortfolioInfo, isForceSettle),
          '4': SettleWrapper(web3, forward, forwardAddress, accounts,
             forwardInfo, setForwardInfo,
             true, portfolioInfo, setPortfolioInfo, isForceSettle),
          '5': contract_expired()
        }[contract_state]
      );
    }

    return (
      <div>
        <h1>Operate Managed Forward</h1>
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
        <table>
          <tbody>
            <tr>
              <th>Issuer Portfolio Address</th>
              <th>{portfolioInfo[0]}</th>
            </tr>
            <tr>
              <th>Buyer Portfolio Address</th>
              <th>{portfolioInfo[1]}</th>
            </tr>
            <tr>
              <th>Unmatched Base Volume</th>
              <th>{portfolioInfo[2]}</th>
            </tr>
            <tr>
              <th>Unmatched Asset Volume</th>
              <th>{portfolioInfo[3]}</th>
            </tr>
            <tr>
              <th>Base Matched Address</th>
              <th>{portfolioInfo[4]}</th>
            </tr>
            <tr>
              <th>Asset Matched Address</th>
              <th>{portfolioInfo[5]}</th>
            </tr>
          </tbody>
        </table>
        <div>{operate_display(forwardInfo[9])}</div>
      </div>
    );
  }
}

export default OperateManagedForward;
