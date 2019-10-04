import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import Web3 from 'web3';

import ProviderMappings from '../../utils/ProviderMappings';
import CustomInputComponent from '../../utils/FormikUtils';
import OptionFactory from '../../atomicoptions/build/contracts/option_factory';
import ERC20 from '../../atomicoptions/build/contracts/ERC20';
import Option from '../../atomicoptions/build/contracts/option';
import MetaMaskNotFound from '../widgets/MetaMaskNotFound';

function CreateCall() {
  const [preface, setPreface] = useState('');
  const [urlPreface, setUrlPreface] = useState('');
  const [result, setResult] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [optionAddress, setOptionAddress] = useState('');
  let metamask_message;
  if (typeof window.ethereum == 'undefined'){
    metamask_message = MetaMaskNotFound();
  } else {
    metamask_message = (function () {
      (async function () {
        let accounts_temp = await window.ethereum.enable();
        setAccounts(accounts_temp);
      })();
      return '';
    })();
  }

  return (
    <div>
      <h1>Create Call Option</h1>
      <div>{metamask_message}</div>
      <Formik
        initialValues={{ buyer: '', base_addr: '', asset_addr:'',
                        fee: '', strike_price_base: '', strike_price_quote: '',
                        volume: '', maturity_time: '', expiry_time:''}}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            actions.setSubmitting(false);

            (function () {
              (async function () {
                let web3 = new Web3(window.ethereum);
                const network_type = await web3.eth.net.getNetworkType();
                const factory_address = ProviderMappings.factory_mappings[network_type];

                let option_factory = new web3.eth.Contract(OptionFactory.abi, factory_address);
                let create_option_call = await (
                  option_factory
                  .methods
                  .createOption(accounts[0], values.buyer,
                    values.base_addr, values.asset_addr,
                    values.fee, values.strike_price_base, values.strike_price_quote,
                    values.volume,
                    values.maturity_time, values.expiry_time)
                  .send({ from: accounts[0] })
                );
                let option_address_temp = create_option_call.events.NewOption.returnValues[0];

                let asset = new web3.eth.Contract(ERC20.abi, values.asset_addr);
                let transfer_call = await (
                  asset
                  .methods
                  .transfer(option_address_temp, values.volume)
                  .send({ from: accounts[0] })
                );

                let option = new web3.eth.Contract(Option.abi, option_address_temp);
                let check_collateralization_call = await (
                  option
                  .methods
                  .check_collateralization()
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
            <Field name="maturity_time" placeholder="Maturity Time" component={CustomInputComponent}/>
            <Field name="expiry_time" placeholder="Expiry Time" component={CustomInputComponent}/>
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
