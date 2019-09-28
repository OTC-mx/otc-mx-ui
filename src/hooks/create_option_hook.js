import React, { useState } from 'react'; 
import Web3 from 'web3';

let factory_address = '0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B';

async function create_call_option(issuer, buyer, base_addr, asset_addr, fee,
    strike_price_base, strike_price_quote, volume, maturity_time, expiry_time) {
  let create_option_call = await (option_factory
    .createOption(issuer, buyer,
      base_addr, asset_addr,
      fee, strike_price_base, strike_price_quote,
      volume,
      maturity_time, expiry_time,
      { from: accounts[0] })
  );
  return;
}
