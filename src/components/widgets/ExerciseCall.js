import React from 'react';
import { Formik, Field } from 'formik';

import { CustomInputComponent } from '../../utils/FormikUtils';

import ERC20 from '../../atomic-options/build/contracts/ERC20';

function ExerciseCall(web3, option, option_address, accounts, optionInfo, setOptionInfo) {
  return(
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
              let asset_exercised = web3.utils.toBN(values.amount);
              let base_exercised = (asset_exercised
                .mul(web3.utils.toBN(optionInfo[6]))
                .div(web3.utils.toBN(optionInfo[5]))
              );
              let approve_call = await (
                base
                .methods
                .approve(option_address, base_exercised.toString())
                .send({ from: accounts[0] })
              );
              let exercise_option_call = await (
                option
                .methods
                .exercise_from_asset(asset_exercised.toString())
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
          <Field name="amount" placeholder="Amount of Asset to Buy" component={CustomInputComponent}/>
          <p></p>
          <button type="submit">Exercise</button>
        </form>
      )}
    />
    </div>
  );
}

export default ExerciseCall;
