import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import Web3 from 'web3';

import ProviderMappings from '../../utils/ProviderMappings';
import CustomInputComponent from '../../utils/FormikUtils';
import PortfolioFactory from '../../atomic-options/build/contracts/PortfolioFactory';
import Portfolio from '../../atomic-options/build/contracts/Portfolio';
import { web3_not_found } from '../widgets/NoOp';

function CreatePortfolio() {
  const [addressPreface, setAddressPreface] = useState('');
  const [preface, setPreface] = useState('');
  const [urlPreface, setUrlPreface] = useState('');
  const [result, setResult] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [portfolioAddress, setPortfolioAddress] = useState('');
  let metamask_message;
  if (typeof window.ethereum == 'undefined'){
    metamask_message = web3_not_found();
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
      <h1>Create Forward Portfolio</h1>
      <div>{metamask_message}</div>
      <Formik
        initialValues={{ base_addr: '', asset_addr:'' }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            actions.setSubmitting(false);

            (function () {
              (async function () {
                let web3 = new Web3(window.ethereum);
                const network_type = await web3.eth.net.getNetworkType();
                const factory_address = ProviderMappings.portfolio_factory_mappings[network_type];

                let portfolio_factory = new web3.eth.Contract(PortfolioFactory.abi, factory_address);
                let create_portfolio_call = await (
                  portfolio_factory
                  .methods
                  .create_portfolio(values.base_addr, values.asset_addr,
                    ProviderMappings.managed_forward_factory_mappings[network_type])
                  .send({ from: accounts[0] })
                );
                let portfolio_address_temp = create_portfolio_call.events.NewPortfolio.returnValues[0];

                setAddressPreface('Portfolio Address: ');
                setPortfolioAddress(portfolio_address_temp);
                setPreface('Shareable URL: ');
                setUrlPreface('https://otc.mx');
                setResult(`/portfolio/${portfolio_address_temp}`);
              })();
            })();
          }, 1000);
        }}
        render={(props: FormikProps<Values>) => (
          <form onSubmit={props.handleSubmit}>
            <Field name="base_addr" placeholder="Base Token Address" component={CustomInputComponent}/>
            <Field name="asset_addr" placeholder="Asset Address" component={CustomInputComponent}/>
            <p></p>
            <button type="submit">Create</button>
          </form>
        )}
      />
      <p>{addressPreface}{portfolioAddress}</p>
      <p>{preface} <a href={result} target="_blank" rel="noopener noreferrer">{urlPreface}{result}</a></p>
    </div>
  );
}


export default CreatePortfolio;
