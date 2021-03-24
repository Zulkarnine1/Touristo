import {useCallback,useReducer} from "react"

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formisvalid = true;
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          formisvalid = formisvalid && action.isValid;
        } else {
          formisvalid = formisvalid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formisvalid,
      };
      case "SET_DATA":
          return {
              inputs:action.inputs,
              isValid:action.formisvalid

          }
    default:
      return state;
  }
};


export const useForm = (initialInputs,initValidity)=>{
    const [formState, dispatch] = useReducer(formReducer, {
      inputs: initialInputs,
      isValid: initValidity,
    });
    const inputHandler = useCallback((id, value, isValid) => {
      dispatch({ type: "INPUT_CHANGE", value: value, isValid: isValid, inputId: id });
    }, []);

    const setFormData = useCallback((inputData,formValidity)=>{
        dispatch({
            type:"SET_DATA",
            inputs:inputData,
            formisvalid:formValidity
        })
    },[])

    return [formState, inputHandler, setFormData];
}