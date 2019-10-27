import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import Web3 from 'web3';
import * as Yup from "yup";

import ProviderMappings from '../../utils/ProviderMappings';
import CustomInputComponent from '../../utils/FormikUtils';
import ManagedForwardFactory from '../../atomic-options/build/contracts/ManagedForwardFactory';
import ERC20 from '../../atomic-options/build/contracts/ERC20';
import ManagedForward from '../../atomic-options/build/contracts/ManagedForward';
import Portfolio from '../../atomic-options/build/contracts/Portfolio';
import MetaMaskNotFound from '../widgets/MetaMaskNotFound';

function CreateManagedForward() {
  const [preface, setPreface] = useState('');
  const [urlPreface, setUrlPreface] = useState('');
  const [result, setResult] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [addressPreface, setAddressPreface] = useState('');
  const [forwardAddress, setForwardAddress] = useState('');
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
      <h1>Create Managed Forward</h1>
      <p>Don't have a Portfolio? Create one <a href="/portfolio">here</a>.</p>
      <div>{metamask_message}</div>
      <Formik
        initialValues={{ buyer: '', base_addr: '', asset_addr:'',
                        strike_price_base: '', strike_price_quote: '',
                        volume: '', maturity_time: '',
                        issuer_portfolio: '', buyer_portfolio: '',
                        collateralize_from: 'address', matched_addr: ''}}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            actions.setSubmitting(false);

            (function () {
              (async function () {
                let web3 = new Web3(window.ethereum);
                const network_type = await web3.eth.net.getNetworkType();
                const factory_address = ProviderMappings.managed_forward_factory_mappings[network_type];

                let forward_factory = new web3.eth.Contract(ManagedForwardFactory.abi, factory_address);
                let create_forward_call = await (
                  forward_factory
                  .methods
                  .create_managed_forward(accounts[0], values.buyer,
                    values.base_addr, values.asset_addr,
                    values.strike_price_base, values.strike_price_quote,
                    values.volume,
                    values.maturity_time,
                    values.issuer_portfolio, values.buyer_portfolio)
                  .send({ from: accounts[0] })
                );
                let forward_address_temp = create_forward_call.events.NewManagedForward.returnValues[0];
                let forward = new web3.eth.Contract(ManagedForward.abi, forward_address_temp);

                let portfolio = new web3.eth.Contract(Portfolio.abi, values.issuer_portfolio);
                let add_managed_forward_call = await (
                  portfolio
                  .methods
                  .add_managed_forward(forward_address_temp)
                  .send({ from: accounts[0] })
                );

                let collateralize_call;
                if (values.collateralize_from == 'address') {
                  let asset = new web3.eth.Contract(ERC20.abi, values.asset_addr);
                  let approve_call = await (
                    asset
                    .methods
                    .approve(forward_address_temp, values.volume)
                    .send({ from: accounts[0] })
                  );
                  collateralize_call = await (
                    forward
                    .methods
                    .collateralize()
                    .send({ from: accounts[0] })
                  );
                } else if (values.collateralize_from == 'portfolio') {
                  collateralize_call = await (
                    forward
                    .methods
                    .collateralize_from_portfolio()
                    .send({ from: accounts[0] })
                  );
                } else if (values.collateralize_from == 'match') {
                  collateralize_call = await (
                    forward
                    .methods
                    .collateralize_from_match(values.matched_addr)
                    .send({ from: accounts[0] })
                  );
                }

                setAddressPreface('Managed Forward Address: ');
                setForwardAddress(forward_address_temp);
                setPreface('Shareable URL: ');
                setUrlPreface('https://otc.mx');
                setResult(`/managedforward/${forward_address_temp}`);
              })();
            })();
          }, 1000);
        }}
        render={(props: FormikProps<Values>) => (
          <form onSubmit={props.handleSubmit}>
            <Field name="buyer" placeholder="Buyer Address" component={CustomInputComponent}/>
            <Field name="base_addr" placeholder="Base Token Address" component={CustomInputComponent}/>
            <Field name="asset_addr" placeholder="Asset Address" component={CustomInputComponent}/>
            <Field name="strike_price_base" placeholder="Base Price" component={CustomInputComponent}/>
            <Field name="strike_price_quote" placeholder="Quote Price" component={CustomInputComponent}/>
            <Field name="volume" placeholder="Asset Volume" component={CustomInputComponent}/>
            <Field name="maturity_time" placeholder="Maturity Time (Unix)" component={CustomInputComponent}/>
            <Field name="issuer_portfolio" placeholder="Issuer Portfolio Address" component={CustomInputComponent}/>
            <Field name="buyer_portfolio" placeholder="Buyer Portfolio Address" component={CustomInputComponent}/>
            <small>Collateralize From: </small>
            <Field name="collateralize_from" component="select" >
              <option value="address">Issuer Address</option>
              <option value="portfolio">Issuer Portfolio</option>
              <option value="match">Another Contract</option>
            </Field>
            <Field name="matched_addr" placeholder="Matched Address" component={CustomInputComponent}/>
            <p></p>
            <button type="submit">Create</button>
          </form>
        )}
      />
      <p>{addressPreface}{forwardAddress}</p>
      <p>{preface} <a href={result} target="_blank" rel="noopener noreferrer">{urlPreface}{result}</a></p>
    </div>
  );
}


export default CreateManagedForward;
