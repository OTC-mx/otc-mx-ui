const React = require('react');
const Web3 = require('web3');
const ProviderMappings = require('../utils/ProviderMappings');
const OptionFactory = require('../atomicoptions/build/contracts/option_factory');

const provider = 'http://localhost:8545'

const useState = React.useState
const web3 = new Web3(new Web3.providers.HttpProvider(provider));
let factory_address = ProviderMappings.factory_mappings[provider];
let option_factory = new web3.eth.Contract(OptionFactory.abi, factory_address);

async function create_call_option(accounts, issuer, buyer, base_addr, asset_addr, fee,
    strike_price_base, strike_price_quote, volume, maturity_time, expiry_time) {
  let create_option_call = await (option_factory
    .methods
    .createOption(issuer, buyer,
      base_addr, asset_addr,
      fee, strike_price_base, strike_price_quote,
      volume,
      maturity_time, expiry_time)
    .send({ from: accounts[0] })
  );
  option_address = create_option_call.events.NewOption.returnValues[0];
  return option_address;
}

async function create_call_wrapper() {
  let accounts = await web3.eth.getAccounts()

  // Variables consistent with createOption
  let issuer = accounts[0];
  let buyer = accounts[1];
  let base_addr = ProviderMappings.local_token_mappings['b'];
  let asset_addr = ProviderMappings.local_token_mappings['a'];
  let fee = '1' + ('0'.repeat(21));
  let strike_price_base = 3;
  let strike_price_quote = 5;
  let volume = '5' + ('0'.repeat(21));
  let maturity_time = '0';
  let expiry_time = '1577836800';

  let option_address = await create_call_option(accounts, issuer, buyer, base_addr, asset_addr, fee,
      strike_price_base, strike_price_quote, volume, maturity_time, expiry_time);

  console.log(option_address);
  return option_address;
}

create_call_wrapper();
