import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import { ethers } from 'ethers';

import ProviderMappings from '../../utils/ProviderMappings';
import { CustomInputComponent, get_schema } from '../../utils/FormikUtils';
import { set_web3 } from '../../utils/EthereumUtils';
import SilentOptionFactory from '../../atomic-options/build/contracts/SilentOptionFactory';
import ERC20 from '../../atomic-options/build/contracts/ERC20';
import SilentOption from '../../atomic-options/build/contracts/SilentOption';

function CreateSilentCall() {
  const [addressPreface, setAddressPreface] = useState('');
  const [preface, setPreface] = useState('');
  const [urlPreface, setUrlPreface] = useState('');
  const [result, setResult] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [silentOptionAddress, setSilentOptionAddress] = useState('');
  let [web3, web3_message] = set_web3(window, setAccounts);

  const initialValues = ({ buyer: '', base_addr: '', asset_addr:'',
                          fee: '', strike_price_base: '', strike_price_quote: '',
                          volume: '', maturity_time: '', expiry_time:'',
                          salt: '' });
  const validationSchema = get_schema(Object.keys(initialValues), web3);

  return (
    <div>
      <h1>Create Silent Call Option</h1>
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
                const factory_address = ProviderMappings.silent_option_factory_mappings[network_type];

                let strike_price_base_unpad = ethers.utils.hexlify(Number(values.strike_price_base));
                let strike_price_quote_unpad = ethers.utils.hexlify(Number(values.strike_price_quote));
                let salt = ethers.utils.hexZeroPad(ethers.utils.hexlify(values.salt), 32);
                let strike_price_base_hex = ethers.utils.hexZeroPad(strike_price_base_unpad, 32);
                let strike_price_quote_hex = ethers.utils.hexZeroPad(strike_price_quote_unpad, 32);
                let strike_price_base_hash = web3.utils.soliditySha3(strike_price_base_hex, salt);
                let strike_price_quote_hash = web3.utils.soliditySha3(strike_price_quote_hex, salt);

                let silent_option_factory = new web3.eth.Contract(SilentOptionFactory.abi, factory_address);
                let create_silent_option_call = await (
                  silent_option_factory
                  .methods
                  .create_silent_option(accounts[0], values.buyer,
                    values.base_addr, values.asset_addr,
                    values.fee, strike_price_base_hash, strike_price_quote_hash,
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
                let collateralize_call = await (
                  silent_option
                  .methods
                  .collateralize()
                  .send({ from: accounts[0] })
                );
                setAddressPreface('Silent Option Address: ');
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
            <Field name="strike_price_base" placeholder="Base Price" component={CustomInputComponent}/>
            <Field name="strike_price_quote" placeholder="Quote Price" component={CustomInputComponent}/>
            <Field name="volume" placeholder="Asset Volume" component={CustomInputComponent}/>
            <Field name="maturity_time" placeholder="Maturity Time (Unix)" component={CustomInputComponent}/>
            <Field name="expiry_time" placeholder="Expiry Time (Unix)" component={CustomInputComponent}/>
            <Field name="salt" placeholder="Cryptographic Salt (hex)" component={CustomInputComponent}/>
            <p></p>
            <button type="submit">Create</button>
          </form>
        )}
      />
      <p>{addressPreface}{silentOptionAddress}</p>
      <p>{preface} <a href={result} target="_blank" rel="noopener noreferrer">{urlPreface}{result}</a></p>
    </div>
  );
}


export default CreateSilentCall;
