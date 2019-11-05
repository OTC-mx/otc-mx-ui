import React, { useState } from 'react';
import { Formik, Field } from 'formik';

import ProviderMappings from '../../utils/ProviderMappings';
import { CustomInputComponent, get_schema } from '../../utils/FormikUtils';
import { set_web3 } from '../../utils/EthereumUtils';
import OptionFactory from '../../atomic-options/build/contracts/OptionFactory';
import ERC20 from '../../atomic-options/build/contracts/ERC20';
import Option from '../../atomic-options/build/contracts/Option';

function CreateCall() {
  const [preface, setPreface] = useState('');
  const [urlPreface, setUrlPreface] = useState('');
  const [result, setResult] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [optionAddress, setOptionAddress] = useState('');
  let [web3, web3_message] = set_web3(window, setAccounts);

  const initialValues = ({ buyer: '', base_addr: '', asset_addr:'',
                          fee: '', strike_price_base: '', strike_price_quote: '',
                          volume: '', maturity_time: '', expiry_time:'' });
  const validationSchema = get_schema(Object.keys(initialValues), web3);
  
  return (
    <div>
      <h1>Create Call Option</h1>
      <div>{web3_message}</div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            actions.setSubmitting(false);

            (function () {
              (async function () {
                const network_type = await web3.eth.net.getNetworkType();
                const factory_address = ProviderMappings.option_factory_mappings[network_type];

                let option_factory = new web3.eth.Contract(OptionFactory.abi, factory_address);
                let create_option_call = await (
                  option_factory
                  .methods
                  .create_option(accounts[0], values.buyer,
                    values.base_addr, values.asset_addr,
                    values.fee, values.strike_price_base, values.strike_price_quote,
                    values.volume,
                    values.maturity_time, values.expiry_time)
                  .send({ from: accounts[0] })
                );
                let option_address_temp = create_option_call.events.NewOption.returnValues[0];

                let asset = new web3.eth.Contract(ERC20.abi, values.asset_addr);
                let approve_call = await (
                  asset
                  .methods
                  .approve(option_address_temp, values.volume)
                  .send({ from: accounts[0] })
                );

                let option = new web3.eth.Contract(Option.abi, option_address_temp);
                let collateralize_call = await (
                  option
                  .methods
                  .collateralize()
                  .send({ from: accounts[0] })
                );
                setOptionAddress(option_address_temp);
                setPreface('Shareable URL: ');
                setUrlPreface('https://otc.mx');
                setResult(`/call/${option_address_temp}`);
              })();
            })();
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
            <Field name="maturity_time" placeholder="Maturity Time (Unix)" component={CustomInputComponent}/>
            <Field name="expiry_time" placeholder="Expiry Time (Unix)" component={CustomInputComponent}/>
            <p></p>
            <button type="submit">Create</button>
          </form>
        )}
      />
      <p>{preface} <a href={result} target="_blank" rel="noopener noreferrer">{urlPreface}{result}</a></p>
    </div>
  );
}


export default CreateCall;
