import { useContext, useRef, useState } from "react";
import authContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";
import { useHistory } from "react-router";
import Loader from "../../assets/svg/Loader";
import ErrorBlock from "../Layout/ErrorBlock";

const ProfileForm = () => {
  const authCtx = useContext(authContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const newPasswordInputRef = useRef();
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

    setIsLoading(true);

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAmdUjwqQybHughzzgSnaZ3RsccptwaOtc",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        setIsLoading(false);

        if (response.ok) {
          history.replace("/");
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
      .catch((error) => setError(error.message));
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input ref={newPasswordInputRef} type="password" id="new-password" />
        {error && (
          <ErrorBlock message={error} bgColor="#9f5ccc" color="white" />
        )}
      </div>
      {isLoading && <Loader color="white" />}
      {!isLoading && (
        <div className={classes.action}>
          <button>Change Password</button>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;
