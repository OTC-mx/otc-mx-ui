import React from 'react';
import { Formik, Field } from 'formik';

import CustomInputComponent from '../../utils/FormikUtils';

import ERC20 from '../../atomic-options/build/contracts/ERC20';

const Withdraw = (web3, accounts, portfolioAddress, portfolio, portfolioInfo, setPortfolioInfo) => (
  <div>
  <h2>Withdraw Funds from this Portfolio</h2>

  <Formik
    id = "nested"
    initialValues={{token: 'base', volume: ''}}
    onSubmit={(values, actions) => {
      setTimeout(() => {
        actions.setSubmitting(false);
        (function () {
          (async function () {

            let withdraw_call;
            if (values.token == 'base') {
              withdraw_call = await (
                portfolio
                .methods
                .withdraw(portfolioInfo[0], values.volume)
                .send({ from: accounts[0] })
              );
            } else if (values.token == 'asset') {
              withdraw_call = await (
                portfolio
                .methods
                .withdraw(portfolioInfo[1], values.volume)
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
        <small>Withdraw: </small>
        <Field name="token" component="select" >
          <option value="base">Base Token</option>
          <option value="asset">Asset</option>
        </Field>
        <Field name="volume" placeholder="Volume" component={CustomInputComponent}/>
        <button type="submit">Withdraw</button>
      </form>
    )}
  />
  </div>
);

export default Withdraw;
