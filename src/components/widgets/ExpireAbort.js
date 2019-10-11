import React from 'react';
import { Formik, Field } from 'formik';

import ERC20 from '../../atomicoptions/build/contracts/ERC20';

const ExpireAbort = (web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo) => (
  <div>
  <h2>Abort this Option</h2>

  <Formik
    id = "nested"
    initialValues={{}}
    onSubmit={(values, actions) => {
      setTimeout(() => {
        actions.setSubmitting(false);
        (function () {
          (async function () {
            let expire_call = await (
              option
              .methods
              .expire()
              .send({ from: accounts[0] })
            );
            let option_info_call = await (
              option
              .methods
              .get_info()
              .call({ from: accounts[0] }, (error, result) => console.log(result) ));

            setOptionInfo(option_info_call);
          })();
        })();
      }, 1000);
    }}
    render={(props: FormikProps<Values>) => (
      <form onSubmit={props.handleSubmit}>
        <button type="submit">Abort</button>
      </form>
    )}
  />
  </div>
);

export default ExpireAbort;
