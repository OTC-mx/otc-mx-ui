import React, { useState } from 'react';
import { Formik, Field } from 'formik';

import ProviderMappings from '../../utils/ProviderMappings';
import { CustomInputComponent, get_schema } from '../../utils/FormikUtils';
import { set_web3 } from '../../utils/EthereumUtils';
import PortfolioFactory from '../../atomic-options/build/contracts/PortfolioFactory';

function CreatePortfolio() {
  const [addressPreface, setAddressPreface] = useState('');
  const [preface, setPreface] = useState('');
  const [urlPreface, setUrlPreface] = useState('');
  const [result, setResult] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [portfolioAddress, setPortfolioAddress] = useState('');
  let [web3, web3_message] = set_web3(window, setAccounts);

  const initialValues = ({ base_addr: '', asset_addr:'' });
  const validationSchema = get_schema(Object.keys(initialValues), web3);

  return (
    <div>
      <h1>Create Forward Portfolio</h1>
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
