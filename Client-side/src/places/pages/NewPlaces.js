import React, {useCallback,useReducer} from "react";

import Input from "../../shared/components/FormElements/Input"
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators"
import Button from "../../shared/components/FormElements/Button"
import "./NewPlaces.css"

const formReducer = (state,action)=>{

    switch (action.type){
      case "INPUT_CHANGE":
        let formisvalid = true
        for (const inputId in state.inputs){
          if(inputId === action.inputId){
            formisvalid = formisvalid && action.isValid
          }else{
            formisvalid = formisvalid && state.inputs[inputId].isValid
          }
        }
        return {
          ...state,
          inputs:{
            ...state.inputs,
            [action.inputId]:{value:action.value,isValid:action.isValid}
          },
          isValid:formisvalid

        }
      default:
        return state
    }
}

const NewPlaces = () => {

  const [formState, dispatch] = useReducer(formReducer,{
    inputs:{
      title:{
        value:"",
        isValid:false
      },
      description: {
        value: "",
        isValid: false
      }
    },
    isValid:false
  })
  
  const inputHandler = useCallback((id,value,isValid)=>{
  
    dispatch({ type:"INPUT_CHANGE",value:value, isValid:isValid, inputId:id})
    },[])
  
    const placeSubmitHandler = event => {
      event.preventDefault()
      console.log(formState.inputs)
    }



  return <form className="place-form" onSubmit={placeSubmitHandler} >
    <Input id="title" element="input" type="text" label="Title" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid title." onInput={inputHandler} />
    <Input id="address" element="input" type="text" label="Address" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid address." onInput={inputHandler} />
    <Input id="description" element="textarea" label="Description" validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid description, at least 5 characters." onInput={inputHandler} />
    <Button type="submit" disabled={!formState.isValid} >Add Place</Button>
  </form>;
};

export default NewPlaces;
