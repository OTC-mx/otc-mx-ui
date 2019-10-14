import React from 'react';

import ChooseExercise from './ChooseExercise';
import Expire from './Expire'
import NoAction from './NoAction'
import Nonparticipant from './Nonparticipant'

function ExerciseExpire(web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo) {

  function choose_widget() {
    let current_time = Math.floor(Date.now() / 1000);
    let address_lower = `${accounts[0]}`.trim().toLowerCase();
    let issuer_lower = `${optionInfo[0]}`.trim().toLowerCase();
    let buyer_lower = `${optionInfo[1]}`.trim().toLowerCase();

    if (address_lower === buyer_lower) {
      let state_exercisable = ((optionInfo[10] == 3) || (optionInfo[10] == 4));
      let time_exercisable = ((current_time > optionInfo[8]) && (current_time < optionInfo[9]));
      if (state_exercisable && time_exercisable) {
        return(ChooseExercise(web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo));
      } else {
        return(NoAction());
      }
    } else if (address_lower === issuer_lower) {
      let expirable = ((current_time > optionInfo[9]) && (optionInfo[10] !== 5) || (optionInfo[7] == 0));
      if (expirable) {
        return(Expire(web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo));
      } else {
        return(NoAction());
      }
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
