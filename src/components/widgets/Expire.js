import React from 'react';
import { Formik, Field } from 'formik';

import ERC20 from '../../atomic-options/build/contracts/ERC20';

const Expire = (web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo, title_str = "Expire") => (
  <div>
  <h2>{title_str} this Option</h2>

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
        <button type="submit">{title_str}</button>
      </form>
    )}
  />
  </div>
);

export default Expire;
