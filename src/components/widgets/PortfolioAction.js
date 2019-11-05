import React from 'react';
import { Formik, Field } from 'formik';

import { CustomInputComponent } from '../../utils/FormikUtils';

import ERC20 from '../../atomic-options/build/contracts/ERC20';

function PortfolioAction(web3, accounts, portfolioAddress, portfolio, portfolioInfo, setPortfolioInfo,
                          title_str, button_str,
                          primary_method,
                          requires_approve = false) {
  return(
    <div>
    <h2>{title_str} this Portfolio</h2>

    <Formik
      id = "nested"
      initialValues={{token: 'base', volume: ''}}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          actions.setSubmitting(false);
          (function () {
            (async function () {

              let token_address = ((values.token == 'base') ? portfolioInfo[0] : portfolioInfo[1]);
              if (requires_approve) {
                let token = new web3.eth.Contract(ERC20.abi, token_address);
                let approve_call = await (
                  token
                  .methods
                  .approve(portfolioAddress, values.volume)
                  .send({ from: accounts[0] })
                );
              }

              let primary_call = await (
                primary_method(token_address, values.volume)
                .send({ from: accounts[0] }));

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
          <small>Token: </small>
          <Field name="token" component="select" >
            <option value="base">Base Token</option>
            <option value="asset">Asset</option>
          </Field>
          <Field name="volume" placeholder="Volume" component={CustomInputComponent}/>
          <button type="submit">{button_str}</button>
        </form>
      )}
    />
    </div>
  );
}

export default PortfolioAction;
