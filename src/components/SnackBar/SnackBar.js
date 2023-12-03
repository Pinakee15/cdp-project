import React, { useState, useEffect } from "react";
import "./SnackBar.css";

const Error = ({ message, showMessageHandler }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      showMessageHandler(false);
      // setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  return visible ? (
    <div className="message-container">
      <p className="message">{message}</p>
    </div>
  ) : null;
};

export default Error;
