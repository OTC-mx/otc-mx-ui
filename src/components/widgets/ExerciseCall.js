import React from 'react';
import { Formik, Field } from 'formik';

import CustomInputComponent from '../../utils/FormikUtils';

import ERC20 from '../../atomicoptions/build/contracts/ERC20';

const ExerciseCall = (web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo) => (
  <div>
  <h2>Exercise this Option</h2>

  <Formik
    id = "nested"
    initialValues={{amount: ''}}
    onSubmit={(values, actions) => {
      setTimeout(() => {
        actions.setSubmitting(false);
        (function () {
          (async function () {
            let base = new web3.eth.Contract(ERC20.abi, optionInfo[2]);
            /*
            let transfer_call = await (
              base
              .methods
              .transfer(option_address, optionInfo[4])
              .send({ from: accounts[0] })
            );
            let check_collateralization_call = await (
              option
              .methods
              .relay_fee()
              .send({ from: accounts[0] })
            );
            */

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
        <Field name="amount" placeholder="Amount of Asset to Buy" component={CustomInputComponent}/>
        <p></p>
        <button type="submit">Exercise</button>
      </form>
    )}
  />
  </div>
);

export default ExerciseCall;
