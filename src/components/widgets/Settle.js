import React from 'react';
import { Formik, Field } from 'formik';

import ERC20 from '../../atomic-options/build/contracts/ERC20';

const Settle = (web3, forward, forward_address, accounts, state_mappings, forwardInfo, setForwardInfo) => (
  <div>
  <h2>Settle this Forward</h2>

  <Formik
    id = "nested"
    initialValues={{}}
    onSubmit={(values, actions) => {
      setTimeout(() => {
        actions.setSubmitting(false);
        (function () {
          (async function () {
            let base = new web3.eth.Contract(ERC20.abi, forwardInfo[2]);
            let settle_call = await (
              forward
              .methods
              .settle()
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
        <button type="submit">Settle</button>
      </form>
    )}
  />
  </div>
);

export default Settle;
