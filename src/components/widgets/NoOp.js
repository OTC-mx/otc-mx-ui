import React from 'react';

const web3_not_found = () => (
  <div>
    <h2>Web3 Browser not Found</h2>
    <p>Please install and enable <a href="https://metamask.io/">MetaMask</a> to allow trading.</p>
  </div>
);

const contract_not_initialized = () => (
  <div>
    <h2>Contract not Initialized/Collateralized</h2>
    <p>You should probably fix this with the API or create a new one.</p>
  </div>
);

const no_action = () => (
  <div>
    <h2>No Action</h2>
    <p>You can't do anything right now.</p>
  </div>
);

const not_a_party = () => (
  <div>
    <h2>Not a Party</h2>
    <p>You're not a party to this contract.</p>
  </div>
);

const contract_expired = () => (
  <div>
    <h2>Contract Expired</h2>
    <p>This contract has been expired. There's nothing to do.</p>
  </div>
);

export { web3_not_found, contract_not_initialized, no_action, not_a_party, contract_expired };
