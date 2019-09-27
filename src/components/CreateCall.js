import React, { useState } from 'react';
import { Formik, Field } from 'formik';


function CreateCall() {
    const [preface, setPreface] = useState('');
    const [urlPreface, setUrlPreface] = useState('');
    const [result, setResult] = useState('');

    return (
      <body>
        <h1>Create Call Option</h1>
        <Formik
          initialValues={{ buyer: '', base_addr: '', asset_addr:'',
                          fee: '', strike_price_base: '', strike_price_quote: '',
                          volume: '', maturity_time: '', expiry_time:''}}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
              var address = '0x00000';

              setPreface('Shareable URL: ');
              setUrlPreface('https://otc.mx')
              setResult(`/call/${address}`);
            }, 1000);
          }}
          render={(props: FormikProps<Values>) => (
            <form onSubmit={props.handleSubmit}>
              <Field name="buyer" placeholder="Buyer Address" component={CustomInputComponent}/>
              <Field name="base_addr" placeholder="Base Token Address" component={CustomInputComponent}/>
              <Field name="asset_addr" placeholder="Asset Address" component={CustomInputComponent}/>
              <Field name="fee" placeholder="Option Fee" component={CustomInputComponent}/>
              <Field name="strike_price_base" placeholder="Base Price" component={CustomInputComponent}/>
              <Field name="strike_price_quote" placeholder="Quote Price" component={CustomInputComponent}/>
              <Field name="volume" placeholder="Asset Volume" component={CustomInputComponent}/>
              <Field name="maturity_time" placeholder="Maturity Time" component={CustomInputComponent}/>
              <Field name="expiry_time" placeholder="Expiry Time" component={CustomInputComponent}/>
              <p></p>
              <button type="submit">Create</button>
            </form>
          )}
        />
        <p>{preface} <a href={result}>{urlPreface}{result}</a></p>
      </body>
    );
}
const CustomInputComponent = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => (
  <div>
    <input type="text" {...field} {...props} />
    {touched[field.name] &&
      errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </div>
);


export default CreateCall;
