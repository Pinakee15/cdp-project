import React, { useState, useEffect } from "react";
import "./SnackBar.css";

const Error = ({ message, showMessageHandler }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      showMessageHandler(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [message]);

  return visible ? (
    <div className="message-container">
      <p className={`${message.variant} message`}>{message.value}</p>
    </div>
  ) : null;
};

export default Error;
