import React from "react";
import "./Button.css";

const Button = ({ handleGenerateDCP, ctaText }) => {
  return (
    <div className="button-container">
      <button onClick={handleGenerateDCP}>{ctaText}</button>
    </div>
  );
};

export default Button;
