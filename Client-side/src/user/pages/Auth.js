import React, {useState, useContext} from "react"
import {AuthContext} from "../../shared/context/auth-context"
import {VALIDATOR_EMAIL,VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH} from "../../shared/util/validators"
import {useForm} from "../../shared/hooks/form-hook"
import Input from "../../shared/components/FormElements/Input"
import Button from "../../shared/components/FormElements/Button"
import Card from "../../shared/components/UIElements/Card"
import "../../places/pages/PlaceForm.css"
import "./Auth.css"

const Auth = (props)=>{

    const auth = useContext(AuthContext)

    const [islogIn,setIsLogIn] = useState(true)

    const [formState, inputHandler, setFormData] = useForm({
        email:{
            value:"",
            isValid:false
        },
        password:{
            value:"",
            isValid:false
        }
    },false)
    
    const switchModeHandler = ()=>{
        if(!islogIn){
            setFormData({
                ...formState,
                name:undefined
            }, formState.inputs.email.isValid && formState.inputs.email.isValid)
        }else{
            setFormData({
                ...formState.inputs,
                name:{
                    value:"",
                    isValid:false
                }
            }, false)
        }
        setIsLogIn(prevMode => !prevMode)
    }


    const authSubmitHandler = (event) =>{
        event.preventDefault()
        console.log(formState.inputs);
        auth.login()

    }


    return <Card className="authentication"> 
    <h2>Login Required</h2>
        <form  onSubmit={authSubmitHandler}>
        {!islogIn && <Input element="input" id="name" type="text" label="Name" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a name." onInput={inputHandler} />}
        <Input id="email" element="input" type="email" label="Email" validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL(),]} errorText="Please enter a valid email." onInput={inputHandler} />
        <Input id="password" element="input" type="password" label="Password" validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]} errorText="Please enter a valid password( Min. 8 characters longs)." onInput={inputHandler}  />
        <div style={{textAlign:"center"}}><Button type="submit" className="comp-center" disabled={!formState.isValid} >{islogIn?"Login":"Register"}</Button></div>

    </form>
        <Button inverse onClick={switchModeHandler}>{islogIn ? "Register" : "Login"}</Button>
    </Card>
}

export default Auth