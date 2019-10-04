import React from 'react';

import ChooseExercise from './ChooseExercise';

function ExerciseExpire(web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo) {

  function choose_widget() {
    return(
      ChooseExercise(web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo)
    );
  };

  return(
    <div>
      {choose_widget()}
    </div>
  );
}

export default ExerciseExpire;
