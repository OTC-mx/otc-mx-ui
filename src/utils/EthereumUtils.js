import { web3_not_found } from '../components/widgets/NoOp';

function set_web3_message(window, setAccounts) {
  let web3_message;
  if (typeof window.ethereum == 'undefined'){
    web3_message = web3_not_found();
  } else {
    web3_message = (function () {
      (async function () {
        let accounts_temp = await window.ethereum.enable();
        setAccounts(accounts_temp);
      })();
      return '';
    })();
  }
  return web3_message;
}

export { set_web3_message };
