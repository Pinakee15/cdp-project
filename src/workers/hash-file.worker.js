import { calculateHash256 } from "../utils/general.utils";
/* eslint-disable no-restricted-globals */
export default () => {
  self.addEventListener("message", function (e) {
    if (!e) return;
    const buffer = e.data;
    console.log("enter test");
    // const hash = calculateHash256(buffer);
    console.log("THE BUFFER WE GOT : ", buffer);
    const hash = "random hash .....";
    self.postMessage(hash);
  });
};
