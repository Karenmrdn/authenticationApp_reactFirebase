import { useState, useRef, useContext } from "react";
import classes from "./AuthForm.module.css";
import Loader from "../../assets/svg/Loader";
import authContext from "../../store/auth-context";
import { useHistory } from "react-router";
import ErrorBlock from "../Layout/ErrorBlock";

const AuthForm = () => {
  const authCtx = useContext(authContext);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const history = useHistory();

  const switchAuthModeHandler = () => {
    setError("");
    setIsLogin((prevVal) => !prevVal);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (
      !enteredEmail.trim() ||
      !enteredEmail.includes("@") ||
      !enteredPassword.trim()
    ) {
      setError(
        "Email must be in correct format and password must not be empty"
      );
      return;
    } // now it does not work cause of 'type' and 'required' validation in inputs

    setIsLoading(true);
    let url = "";

    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAmdUjwqQybHughzzgSnaZ3RsccptwaOtc";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAmdUjwqQybHughzzgSnaZ3RsccptwaOtc";
    }

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        setIsLoading(false);

        if (response.ok) {
          setError("");
          return response.json();
        } else {
          return response.json().then((data) => {
            let errorMessage = "Authentication failed!";

            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );

        authCtx.login(data.idToken, expirationTime.toISOString());
        history.replace("/");
      })
      .catch((error) => setError(error.message));
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input ref={emailInputRef} type="email" id="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            ref={passwordInputRef}
            type="password"
            id="password"
            required
          />
        </div>
        {error && <ErrorBlock message={error} />}
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <Loader color="white" />}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
