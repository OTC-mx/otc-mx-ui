import React from 'react';

import { state_vals } from '../../utils/StateMappings';
import ChooseExercise from './ChooseExercise';
import { expire } from './SingleButtonWrappers';
import { no_action, not_a_party } from './NoOp';

function ExerciseExpire(web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo,
                        is_tokenized = false,
                        tokenInfo = [0] * 7, setTokenInfo = 0) {

  function choose_widget() {
    let current_time = Math.floor(Date.now() / 1000);
    let address_lower = `${accounts[0]}`.trim().toLowerCase();
    let issuer_lower = `${optionInfo[0]}`.trim().toLowerCase();
    let buyer_lower = `${optionInfo[1]}`.trim().toLowerCase();

    let state_exercisable = ((optionInfo[10] == state_vals.active) ||
                              (optionInfo[10] == state_vals.exercised));
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
                                    (optionInfo[10] !== state_vals.expired) &&
                                    (address_lower == issuer_lower));
    let expirable = (tokenized_expirable || non_tokenized_expirable);

    if (exercisable) {
      return(ChooseExercise(web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo,
                            is_tokenized,
                            tokenInfo, setTokenInfo));
    } else if (expirable) {
      return(expire(web3, option, option_address, accounts,
                    state_mappings, optionInfo, setOptionInfo, "Expire",
                    is_tokenized,
                    tokenInfo, setTokenInfo));
    } else if ((address_lower === issuer_lower) || (address_lower == buyer_lower) ||
                (is_tokenized && (tokenInfo[0] + tokenInfo[5] > 0) )) {
      return(no_action());
    } else {
      return(not_a_party());
    }
  };

  return(
    <div>
      {choose_widget()}
    </div>
  );
}

export default ExerciseExpire;
