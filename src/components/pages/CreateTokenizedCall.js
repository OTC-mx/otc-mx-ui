import React, { useState } from 'react';
import { Formik, Field } from 'formik';

import ProviderMappings from '../../utils/ProviderMappings';
import { CustomInputComponent, get_schema } from '../../utils/FormikUtils';
import { set_web3 } from '../../utils/EthereumUtils';
import TokenizedOptionFactory from '../../atomic-options/build/contracts/TokenizedOptionFactory';
import PoolToken from '../../atomic-options/build/contracts/PoolToken';
import TokenizedOption from '../../atomic-options/build/contracts/Option';

function CreateTokenizedCall() {
  const [addressPreface, setAddressPreface] = useState('');
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
      <h1>Create Tokenized Call Option</h1>
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
                const tokenized_factory_address = ProviderMappings.tokenized_option_factory_mappings[network_type];

                let tokenized_option_factory = new web3.eth.Contract(TokenizedOptionFactory.abi, tokenized_factory_address);

                let base = new web3.eth.Contract(PoolToken.abi, values.base_addr);
                let asset = new web3.eth.Contract(PoolToken.abi, values.asset_addr);

                let base_name = (base
                  .methods
                  .name()
                  .call({ from: accounts[0] }, (error, result) => console.log(result) ));
                let base_symbol = (base
                  .methods
                  .symbol()
                  .call({ from: accounts[0] }, (error, result) => console.log(result) ));

                let asset_name = (asset
                  .methods
                  .name()
                  .call({ from: accounts[0] }, (error, result) => console.log(result) ));
                let asset_symbol = (asset
                  .methods
                  .symbol()
                  .call({ from: accounts[0] }, (error, result) => console.log(result) ));

                let option_claim_name = `${base_name} ${asset_name} ${values.strike_price_base} / ${values.strike_price_quote} Option`
                let option_claim_symbol = `${base_symbol}${asset_symbol}${values.strike_price_base}/${values.strike_price_quote}O`
                let collateral_claim_name = `${base_name} ${asset_name} ${values.strike_price_base} / ${values.strike_price_quote} Collateral`
                let collateral_claim_symbol = `${base_symbol}${asset_symbol}${values.strike_price_base}/${values.strike_price_quote}C`

                let create_tokenized_option_call = await (
                  tokenized_option_factory
                  .methods
                  .create_tokenized_option(accounts[0], values.buyer,
                    values.base_addr, values.asset_addr,
                    values.fee, values.strike_price_base, values.strike_price_quote,
                    values.volume,
                    values.maturity_time, values.expiry_time,
                    option_claim_name, option_claim_symbol,
                    collateral_claim_name, collateral_claim_symbol)
                  .send({ from: accounts[0] })
                );
                let tokenized_option_address_temp = create_tokenized_option_call.events.NewTokenizedOption.returnValues[0];

                let approve_call = await (
                  asset
                  .methods
                  .approve(tokenized_option_address_temp, values.volume)
                  .send({ from: accounts[0] })
                );

                let tokenized_option = new web3.eth.Contract(TokenizedOption.abi, tokenized_option_address_temp);
                let collateralize_call = await (
                  tokenized_option
                  .methods
                  .collateralize()
                  .send({ from: accounts[0] })
                );
                setAddressPreface('Tokenized Option Address: ');
                setOptionAddress(tokenized_option_address_temp);
                setPreface('Shareable URL: ');
                setUrlPreface('https://otc.mx');
                setResult(`/tokenizedcall/${tokenized_option_address_temp}`);
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
      <p>{addressPreface}{optionAddress}</p>
      <p>{preface} <a href={result} target="_blank" rel="noopener noreferrer">{urlPreface}{result}</a></p>
    </div>
  );
}


export default CreateTokenizedCall;
