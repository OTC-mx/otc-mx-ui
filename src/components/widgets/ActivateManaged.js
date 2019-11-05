import React from 'react';
import { Formik, Field } from 'formik';

import { CustomInputComponent, get_schema } from '../../utils/FormikUtils';

import ERC20 from '../../atomic-options/build/contracts/ERC20';
import Portfolio from '../../atomic-options/build/contracts/Portfolio';

function ActivateManaged(web3, forward, forward_address, accounts, forwardInfo, setForwardInfo,
                          portfolioInfo, setPortfolioInfo) {
  const initialValues = ({ activate_from: 'address', matched_addr: '' });
  const validationSchema = get_schema(Object.keys(initialValues), web3);

  return(
    <div>
    <h2>Activate this Managed Forward</h2>

    <Formik
      id = "nested"
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          actions.setSubmitting(false);
          (function () {
            (async function () {
              let portfolio = new web3.eth.Contract(Portfolio.abi, portfolioInfo[1]);
              let add_managed_forward_call = await (
                portfolio
                .methods
                .add_managed_forward(forward_address)
                .send({ from: accounts[0] })
              );

              let activate_call;
              if (values.activate_from == 'address') {
                let base = new web3.eth.Contract(ERC20.abi, forwardInfo[2]);
                let approve_call = await (
                  base
                  .methods
                  .approve(forward_address, forwardInfo[7])
                  .send({ from: accounts[0] })
                );
                activate_call = await (
                  forward
                  .methods
                  .activate()
                  .send({ from: accounts[0] })
                );
              } else if (values.activate_from == 'portfolio') {
                activate_call = await (
                  forward
                  .methods
                  .activate_from_portfolio()
                  .send({ from: accounts[0] })
                );
              } else if (values.activate_from == 'match') {
                activate_call = await (
                  forward
                  .methods
                  .activate_from_match(values.matched_addr)
                  .send({ from: accounts[0] })
                );
              }

              let forward_info_call = await (
                forward
                .methods
                .get_info()
                .call({ from: accounts[0] }, (error, result) => console.log(result) ));
              let portfolio_info_call = await (
                forward
                .methods
                .get_portfolio_info()
                .call({ from: accounts[0] }, (error, result) => console.log(result) ));

              setForwardInfo(forward_info_call);
              setPortfolioInfo(portfolio_info_call);
            })();
          })();
        }, 1000);
      }}
      render={(props: FormikProps<Values>) => (
        <form onSubmit={props.handleSubmit}>
          <small>Activate From: </small>
          <Field name="activate_from" component="select" >
            <option value="address">Buyer Address</option>
            <option value="portfolio">Buyer Portfolio</option>
            <option value="match">Another Contract</option>
          </Field>
          <Field name="matched_addr" placeholder="Matched Address" component={CustomInputComponent}/>
          <button type="submit">Activate</button>
        </form>
      )}
    />
    </div>
  );
}

export default ActivateManaged;
