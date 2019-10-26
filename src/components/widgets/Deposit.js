import React from 'react';
import { Formik, Field } from 'formik';

import CustomInputComponent from '../../utils/FormikUtils';

import ERC20 from '../../atomic-options/build/contracts/ERC20';

const Deposit = (web3, accounts, portfolioAddress, portfolio, portfolioInfo, setPortfolioInfo) => (
  <div>
  <h2>Deposit Funds to this Portfolio</h2>

  <Formik
    id = "nested"
    initialValues={{token: 'base', volume: ''}}
    onSubmit={(values, actions) => {
      setTimeout(() => {
        actions.setSubmitting(false);
        (function () {
          (async function () {

            let deposit_call;
            let approve_call;
            if (values.token == 'base') {
              let base = new web3.eth.Contract(ERC20.abi, portfolioInfo[0]);
              approve_call = await (
                base
                .methods
                .approve(portfolioAddress, values.volume)
                .send({ from: accounts[0] })
              );
              deposit_call = await (
                portfolio
                .methods
                .deposit(portfolioInfo[0], values.volume)
                .send({ from: accounts[0] })
              );
            } else if (values.token == 'asset') {
              let asset = new web3.eth.Contract(ERC20.abi, portfolioInfo[1]);
              approve_call = await (
                asset
                .methods
                .approve(portfolioAddress, values.volume)
                .send({ from: accounts[0] })
              );
              deposit_call = await (
                portfolio
                .methods
                .deposit(portfolioInfo[1], values.volume)
                .send({ from: accounts[0] })
              );
            }

            let portfolio_info_call = await (
              portfolio
              .methods
              .get_info()
              .call({ from: accounts[0] }, (error, result) => console.log(result) ));

            setPortfolioInfo(portfolio_info_call);
          })();
        })();
      }, 1000);
    }}
    render={(props: FormikProps<Values>) => (
      <form onSubmit={props.handleSubmit}>
        <small>Deposit: </small>
        <Field name="token" component="select" >
          <option value="base">Base Token</option>
          <option value="asset">Asset</option>
        </Field>
        <Field name="volume" placeholder="Volume" component={CustomInputComponent}/>
        <button type="submit">Deposit</button>
      </form>
    )}
  />
  </div>
);

export default Deposit;
