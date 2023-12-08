import React from "react";
import "./Loader.css";

const Loader = ({ loaderText }) => {
  return (
    <div className="loader-container">
      <img src={process.env.PUBLIC_URL + "/fileloading.gif"} />
      <p className="loader-text">{loaderText}</p>
    </div>
  );
};

export default Loader;
