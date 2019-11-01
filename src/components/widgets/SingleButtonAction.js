import React from 'react';
import { Formik, Field } from 'formik';

const SingleButtonAction = (web3, derivative, derivative_address, accounts,
                            derivativeInfo, setDerivativeInfo,
                            title_str, button_str,
                            primary_method,
                            requires_approve = false, approve_method = 0,
                            requires_post = false,
                            post_info_method = 0, postInfo = 0, setPostInfo = 0) => (
  <div>
  <h2>{title_str} this Contract</h2>

  <Formik
    id = "nested"
    initialValues={{}}
    onSubmit={(values, actions) => {
      setTimeout(() => {
        actions.setSubmitting(false);
        (function () {
          (async function () {

            if (requires_approve) {
              let approve_call = await (approve_method.send({ from: accounts[0] }));
            }

            let primary_call = await primary_method.send({ from: accounts[0] });

            let derivative_info_call = await (
              derivative
              .methods
              .get_info()
              .call({ from: accounts[0] }, (error, result) => console.log(result) ));
            setDerivativeInfo(derivative_info_call);

            if (requires_post) {
              let post_info_call = await (
                post_info_method
                .call({ from: accounts[0] }, (error, result) => console.log(result) ));
              setPostInfo(post_info_call);
            }
          })();
        })();
      }, 1000);
    }}
    render={(props: FormikProps<Values>) => (
      <form onSubmit={props.handleSubmit}>
        <button type="submit">{button_str}</button>
      </form>
    )}
  />
  </div>
);

export default SingleButtonAction;
