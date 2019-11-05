import Web3 from 'web3';

import { web3_not_found } from '../components/widgets/NoOp';

function set_web3(window, setAccounts) {
  let web3_message = '';
  let web3 = '';
  if (typeof window.ethereum == 'undefined'){
    web3_message = web3_not_found();
  } else {
    (function () {
      (async function () {
        let accounts_temp = await window.ethereum.enable();
        setAccounts(accounts_temp);
      })();
    })();
    web3 = new Web3(window.ethereum);
  }
  return [web3, web3_message];
}

export { set_web3 };
