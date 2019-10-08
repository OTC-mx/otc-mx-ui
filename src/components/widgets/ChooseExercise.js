import React from 'react';

import ExerciseCall from './ExerciseCall';
import ExerciseSilentCall from './ExerciseSilentCall';

function ChooseExercise(web3, option, option_address, accounts, state_mappings, optionInfo, setOptionInfo) {
  function choose_exercise() {
    let url_arr = window.location.pathname.split("/").filter((e) => e !== "");
    url_arr.pop();
    let url_stub = url_arr.pop();
    return (
      {
        'call': ExerciseCall(web3, option, option_address, accounts,
           state_mappings, optionInfo, setOptionInfo),
        'silentcall': ExerciseSilentCall(web3, option, option_address, accounts,
          state_mappings, optionInfo, setOptionInfo),
        // 'put': ExercisePut(web3, option, option_address, accounts,
        //   state_mappings, optionInfo, setOptionInfo),
        // 'silentput': ExerciseSilentPut(web3, option, option_address, accounts,
        //   state_mappings, optionInfo, setOptionInfo),
      }[url_stub]
    );
  };
  return(
    <div>
      {choose_exercise()}
    </div>
  );
}

export default ChooseExercise;
