import React from 'react';

import ExerciseCall from './ExerciseCall';
import ExerciseTokenizedCall from './ExerciseTokenizedCall';
import ExerciseSilentCall from './ExerciseSilentCall';

function ChooseExercise(web3, option, option_address, accounts, optionInfo, setOptionInfo,
                        is_tokenized,
                        tokenInfo, setTokenInfo) {
  function choose_exercise() {
    let url_arr = window.location.pathname.split("/").filter((e) => e !== "");
    url_arr.pop();
    let url_stub = url_arr.pop();
    return (
      {
        'call': ExerciseCall(web3, option, option_address, accounts,
           optionInfo, setOptionInfo),
        'silentcall': ExerciseSilentCall(web3, option, option_address, accounts,
          optionInfo, setOptionInfo),
        'tokenizedcall': ExerciseTokenizedCall(web3, option, option_address, accounts,
          optionInfo, setOptionInfo,
          tokenInfo, setTokenInfo),
        // 'put': ExercisePut(web3, option, option_address, accounts,
        //   optionInfo, setOptionInfo),
        // 'silentput': ExerciseSilentPut(web3, option, option_address, accounts,
        //   optionInfo, setOptionInfo),
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
