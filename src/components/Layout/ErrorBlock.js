import React from "react";
import classes from "./ErrorBlock.module.css";

const ErrorBlock = ({ message, bgColor = "#fff", color = "red" }) => {
  return (
    <p className={classes.error} style={{ backgroundColor: bgColor, color }}>
      {message}
    </p>
  );
};

export default ErrorBlock;
