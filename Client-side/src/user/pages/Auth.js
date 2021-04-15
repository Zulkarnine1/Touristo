import React, { useState, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { VALIDATOR_EMAIL, VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "../../places/pages/PlaceForm.css";
import "./Auth.css";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

const Auth = (props) => {
  const auth = useContext(AuthContext);

  const [islogIn, setIsLogIn] = useState(true);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!islogIn) {
      setFormData(
        {
          ...formState,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.email.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLogIn((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (islogIn) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        auth.login(responseData.user.id);
      } catch (err) {}
    } else {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        auth.login(responseData.user.id);
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <form onSubmit={authSubmitHandler}>
          {!islogIn && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email."
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
            errorText="Please enter a valid password( Min. 8 characters longs)."
            onInput={inputHandler}
          />
          <div style={{ textAlign: "center" }}>
            <Button type="submit" className="comp-center" disabled={!formState.isValid}>
              {islogIn ? "Login" : "Register"}
            </Button>
          </div>
        </form>
        <Button inverse onClick={switchModeHandler}>
          {islogIn ? "Register" : "Login"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
