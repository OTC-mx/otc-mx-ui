import React from 'react';
import { Formik, Field } from 'formik';
import { ethers } from 'ethers';

import CustomInputComponent from '../../utils/FormikUtils';

import ERC20 from '../../atomicoptions/build/contracts/ERC20';

const ExerciseSilentCall = (web3, silent_option, silent_option_address, accounts, state_mappings, silentOptionInfo, setSilentOptionInfo) => (
  <div>
  <h2>Exercise this Option</h2>

  <Formik
    id = "nested"
    initialValues={{strike_price_base: '', strike_price_quote:'', salt: '', amount: ''}}
    onSubmit={(values, actions) => {
      setTimeout(() => {
        actions.setSubmitting(false);
        (function () {
          (async function () {
            let base = new web3.eth.Contract(ERC20.abi, silentOptionInfo[2]);
            let asset_exercised = web3.utils.toBN(values.amount);
            let base_exercised = (asset_exercised
              .mul(web3.utils.toBN(values.strike_price_quote))
              .div(web3.utils.toBN(values.strike_price_base))
            );
            let salt = ethers.utils.hexZeroPad(ethers.utils.hexlify(values.salt), 32);
            
            let approve_call = await (
              base
              .methods
              .approve(silent_option_address, base_exercised.toString())
              .send({ from: accounts[0] })
            );
            let exercise_silent_option_call = await (
              silent_option
              .methods
              .exercise_from_asset(values.strike_price_base,
                values.strike_price_quote, salt, asset_exercised.toString())
              .send({ from: accounts[0] })
            );
            let silent_option_info_call = await (
              silent_option
              .methods
              .get_info()
              .call({ from: accounts[0] }, (error, result) => console.log(result) ));
            setSilentOptionInfo(silent_option_info_call);
          })();
        })();
      }, 1000);
    }}
    render={(props: FormikProps<Values>) => (
      <form onSubmit={props.handleSubmit}>
        <Field name="strike_price_base" placeholder="Base Price" component={CustomInputComponent}/>
        <Field name="strike_price_quote" placeholder="Quote Price" component={CustomInputComponent}/>
        <Field name="salt" placeholder="Salt" component={CustomInputComponent}/>
        <Field name="amount" placeholder="Amount of Asset to Buy" component={CustomInputComponent}/>
        <p></p>
        <button type="submit">Exercise</button>
      </form>
    )}
  />
  </div>
);

export default ExerciseSilentCall;
