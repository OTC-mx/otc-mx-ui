import React, { useState, useEffect } from 'react';
import { Formik, Field } from 'formik';
import Web3 from 'web3';

import CustomInputComponent from '../../utils/FormikUtils';
import Portfolio from '../../atomic-options/build/contracts/Portfolio';

import MetaMaskNotFound from '../widgets/MetaMaskNotFound';
import DepositWithdrawWrapper from '../widgets/DepositWithdrawWrapper';

function OperatePortfolio() {
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState({});
  const [portfolioAddress, setPortfolioAddress] = useState({});
  const [portfolio, setPortfolio] = useState({});
  const [portfolioInfo, setPortfolioInfo] = useState([]);

  useEffect(() => {
    (function () {
      (async function () {
        if (typeof window.ethereum == 'undefined'){ return; }
        let accounts_temp = await window.ethereum.enable();
        let web3_temp = new Web3(window.ethereum);
        let portfolio_address_temp = window.location.pathname.split("/").filter((e) => e !== "").pop();

        let portfolio_temp = new web3_temp.eth.Contract(Portfolio.abi, portfolio_address_temp);

        let portfolio_info_call = await (
          portfolio_temp
          .methods
          .get_info()
          .call({ from: accounts_temp[0] }, (error, result) => console.log(result) ));

        setAccounts(accounts_temp);
        setWeb3(web3_temp);
        setPortfolioAddress(portfolio_address_temp);
        setPortfolio(portfolio_temp);
        setPortfolioInfo(portfolio_info_call);
      })();
    })();
  }, []);
  if (typeof window.ethereum == 'undefined'){
    return(
      <div>
        <h1>Operate Managed Forward</h1>
        <div>{MetaMaskNotFound()}</div>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Operate Portfolio</h1>
        <h2>About this Portfolio</h2>
        <table>
          <tbody>
            <tr>
              <th>Contract Address</th>
              <th>{portfolioAddress.toString()}</th>
            </tr>
            <tr>
              <th>Base Token Address</th>
              <th>{portfolioInfo[0]}</th>
            </tr>
            <tr>
              <th>Asset Address</th>
              <th>{portfolioInfo[1]}</th>
            </tr>
            <tr>
              <th>Owner</th>
              <th>{portfolioInfo[2]}</th>
            </tr>
            <tr>
              <th>Base Volume Available</th>
              <th>{portfolioInfo[4]}</th>
            </tr>
            <tr>
              <th>Asset Volume Available</th>
              <th>{portfolioInfo[5]}</th>
            </tr>
          </tbody>
        </table>
        <div>
          {DepositWithdrawWrapper(web3, accounts, portfolioAddress, portfolio, portfolioInfo, setPortfolioInfo)}
        </div>
      </div>
    );
  }
}

export default OperatePortfolio;
