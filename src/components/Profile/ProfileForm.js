import { useContext, useRef } from "react";
import authContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";
import { useHistory } from "react-router";

const ProfileForm = () => {
  const authCtx = useContext(authContext);
  const newPasswordInputRef = useRef();
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

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
    ).then((response) => {
      // We expect that it will always succeed
      // Of course, that is not true, so we need to add error handling

      history.replace("/");
    });
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input ref={newPasswordInputRef} type="password" id="new-password" />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
