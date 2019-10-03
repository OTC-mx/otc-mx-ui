import React, { useState, useEffect } from 'react';
import { Formik, Field } from 'formik';
import Web3 from 'web3';

import CustomInputComponent from '../utils/FormikUtils';
import { state_mappings } from '../utils/StateMappings';
import MetaMaskNotFound from './MetaMaskNotFound';
import CallOption from '../atomicoptions/build/contracts/call_option';

function OperateCall() {
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState({});
  const [optionAddress, setOptionAddress] = useState({});
  const [callOption, setCallOption] = useState({});
  const [optionInfo, setOptionInfo] = useState([]);

  useEffect(() => {
    (function () {
      (async function () {
        if (typeof window.ethereum == 'undefined'){ return; }
        let accounts_temp = await window.ethereum.enable();
        let web3_temp = new Web3(window.ethereum);
        let option_address_temp = window.location.pathname.split("/").filter((e) => e !== "").pop();

        let call_option_temp = new web3_temp.eth.Contract(CallOption.abi, option_address_temp);

        let option_info_call = await (
          call_option_temp
          .methods
          .get_info()
          .call({ from: accounts_temp[0] }, (error, result) => console.log(result) ));
        console.log(option_info_call);

        setAccounts(accounts_temp);
        setWeb3(web3_temp);
        setOptionAddress(option_address_temp);
        setCallOption(call_option_temp);
        setOptionInfo(option_info_call);
      })();
    })();
  }, []);
  if (typeof window.ethereum == 'undefined'){
    return(
      <div>
        <h1>Operate Call Option</h1>
        <p>{MetaMaskNotFound()}</p>
      </div>
    );
  } else {
    (function () {
      (async function () {

      })();
      return '';
    })();

    return (
      <div>
        <h1>Operate Call Option</h1>
        <h2>About this Option</h2>
        <table>
          <tbody>
            <tr>
              <th>Issuer Address</th>
              <th>{optionInfo[0]}</th>
            </tr>
            <tr>
              <th>Buyer Address</th>
              <th>{optionInfo[1]}</th>
            </tr>
            <tr>
              <th>Base Token Address</th>
              <th>{optionInfo[2]}</th>
            </tr>
            <tr>
              <th>Asset Address</th>
              <th>{optionInfo[3]}</th>
            </tr>
            <tr>
              <th>Fee (smallest unit Base Token)</th>
              <th>{optionInfo[4]}</th>
            </tr>
            <tr>
              <th>Base Strike Price / Quote Strike Price</th>
              <th>{optionInfo[5]} / {optionInfo[6]}</th>
            </tr>
            <tr>
              <th>Volume (smallest unit Asset)</th>
              <th>{optionInfo[7]}</th>
            </tr>
            <tr>
              <th>Maturity Time</th>
              <th>{optionInfo[8]}</th>
            </tr>
            <tr>
              <th>Expiry Time</th>
              <th>{optionInfo[9]}</th>
            </tr>
            <tr>
              <th>State</th>
              <th>{state_mappings[optionInfo[10]]}</th>
            </tr>
          </tbody>
        </table>

        <h2>Pay Fee for this Option</h2>

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
                  // let call_option = new web3.eth.Contract(CallOption.abi, option_address_temp);
                  /*
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

                  let call_option = new web3.eth.Contract(CallOption.abi, option_address_temp);
                  let check_collateralization_call = await (
                    call_option
                    .methods
                    .check_collateralization()
                    .send({ from: accounts[0] })
                  );

                  setOptionAddress(option_address_temp);
                  setPreface('Shareable URL: ');
                  setUrlPreface('https://otc.mx');
                  setResult(`/call/${option_address_temp}`);
                  */
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
      </div>
    );
  }
}

export default OperateCall;
