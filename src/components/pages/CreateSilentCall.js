import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import Web3 from 'web3';

import ProviderMappings from '../../utils/ProviderMappings';
import CustomInputComponent from '../../utils/FormikUtils';
import SilentOptionFactory from '../../atomicoptions/build/contracts/silent_option_factory';
import ERC20 from '../../atomicoptions/build/contracts/ERC20';
import SilentOption from '../../atomicoptions/build/contracts/silent_option';
import MetaMaskNotFound from '../widgets/MetaMaskNotFound';

function CreateSilentCall() {
  const [preface, setPreface] = useState('');
  const [urlPreface, setUrlPreface] = useState('');
  const [result, setResult] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [silentOptionAddress, setSilentOptionAddress] = useState('');
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
      <h1>Create Silent Call Option</h1>
      <div>{metamask_message}</div>
      <Formik
        initialValues={{ buyer: '', base_addr: '', asset_addr:'',
                        fee: '', strike_price_base_hash: '', strike_price_quote_hash: '',
                        volume: '', maturity_time: '', expiry_time:''}}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            actions.setSubmitting(false);

            (function () {
              (async function () {
                let web3 = new Web3(window.ethereum);
                const network_type = await web3.eth.net.getNetworkType();
                const factory_address = ProviderMappings.silent_option_factory_mappings[network_type];

                let silent_option_factory = new web3.eth.Contract(SilentOptionFactory.abi, factory_address);
                let create_silent_option_call = await (
                  silent_option_factory
                  .methods
                  .createSilentOption(accounts[0], values.buyer,
                    values.base_addr, values.asset_addr,
                    values.fee, values.strike_price_base_hash, values.strike_price_quote_hash,
                    values.volume,
                    values.maturity_time, values.expiry_time)
                  .send({ from: accounts[0] })
                );
                let silent_option_address_temp = create_silent_option_call.events.NewSilentOption.returnValues[0];

                let asset = new web3.eth.Contract(ERC20.abi, values.asset_addr);
                let approve_call = await (
                  asset
                  .methods
                  .approve(silent_option_address_temp, values.volume)
                  .send({ from: accounts[0] })
                );

                let silent_option = new web3.eth.Contract(SilentOption.abi, silent_option_address_temp);
                let check_collateralization_call = await (
                  silent_option
                  .methods
                  .collateralize()
                  .send({ from: accounts[0] })
                );
                setSilentOptionAddress(silent_option_address_temp);
                setPreface('Shareable URL: ');
                setUrlPreface('https://otc.mx');
                setResult(`/silentcall/${silent_option_address_temp}`);
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
            <Field name="strike_price_base_hash" placeholder="Base Price Hash" component={CustomInputComponent}/>
            <Field name="strike_price_quote_hash" placeholder="Quote Price Hash" component={CustomInputComponent}/>
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


export default CreateSilentCall;
