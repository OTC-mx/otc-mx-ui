import React from 'react';

import ChooseExercise from './ChooseExercise';
import Expire from './Expire'
import NoAction from './NoAction'
import Nonparticipant from './Nonparticipant'

function ExerciseExpire(web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo,
                        is_tokenized = false,
                        tokenInfo = [0] * 7, setTokenInfo = 0) {

  function choose_widget() {
    let current_time = Math.floor(Date.now() / 1000);
    let address_lower = `${accounts[0]}`.trim().toLowerCase();
    let issuer_lower = `${optionInfo[0]}`.trim().toLowerCase();
    let buyer_lower = `${optionInfo[1]}`.trim().toLowerCase();

    let state_exercisable = ((optionInfo[10] == 3) || (optionInfo[10] == 4));
    let time_exercisable = ((current_time > optionInfo[8]) && (current_time < optionInfo[9]));
    let tokenized_exercisable = (is_tokenized && (tokenInfo[4] > 0));
    let non_tokenized_exercisable = ((! is_tokenized) &&
                                    (address_lower == buyer_lower) &&
                                    (optionInfo[7] > 0))
    let exercisable = ((state_exercisable && time_exercisable) &&
                        (tokenized_exercisable || non_tokenized_exercisable));

    let tokenized_expirable = ((is_tokenized) &&
                                ((current_time > optionInfo[9]) || (tokenInfo[2] == 0)) &&
                                (tokenInfo[5] > 0));
    let non_tokenized_expirable = ((! is_tokenized) &&
                                    (current_time > optionInfo[9] || (optionInfo[7] == 0)) &&
                                    (optionInfo[10] !== 5) &&
                                    (address_lower == issuer_lower));
    let expirable = (tokenized_expirable || non_tokenized_expirable);

    if (exercisable) {
      return(ChooseExercise(web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo,
                            is_tokenized,
                            tokenInfo, setTokenInfo));
    } else if (expirable) {
      return(Expire(web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo, "Expire",
                    is_tokenized,
                    tokenInfo, setTokenInfo));
    } else if ((address_lower === issuer_lower) || (address_lower == buyer_lower) ||
                (is_tokenized && (tokenInfo[0] + tokenInfo[5] > 0) )) {
      return(NoAction());
    } else {
      return(Nonparticipant());
    }
  };

  return(
    <div>
      {choose_widget()}
    </div>
  );
}

export default ExerciseExpire;
