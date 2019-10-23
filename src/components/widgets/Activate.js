import React from 'react';
import { Formik, Field } from 'formik';

import ERC20 from '../../atomic-options/build/contracts/ERC20';

const Activate = (web3, forward, forward_address, accounts, state_mappings, forwardInfo, setForwardInfo) => (
  <div>
  <h2>Activate this Forward</h2>

  <Formik
    id = "nested"
    initialValues={{}}
    onSubmit={(values, actions) => {
      setTimeout(() => {
        actions.setSubmitting(false);
        (function () {
          (async function () {
            let base = new web3.eth.Contract(ERC20.abi, forwardInfo[2]);
            let approve_call = await (
              base
              .methods
              .approve(forward_address, forwardInfo[7])
              .send({ from: accounts[0] })
            );
            let activate_call = await (
              forward
              .methods
              .activate()
              .send({ from: accounts[0] })
            );
            let forward_info_call = await (
              forward
              .methods
              .get_info()
              .call({ from: accounts[0] }, (error, result) => console.log(result) ));

            setForwardInfo(forward_info_call);
          })();
        })();
      }, 1000);
    }}
    render={(props: FormikProps<Values>) => (
      <form onSubmit={props.handleSubmit}>
        <button type="submit">Activate</button>
      </form>
    )}
  />
  </div>
);

export default Activate;
