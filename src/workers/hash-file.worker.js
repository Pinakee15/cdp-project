import { calculateHash256 } from "../utils/general.utils";
/* eslint-disable no-restricted-globals */
export default () => {
  self.addEventListener("message", function (e) {
    if (!e) return;
    // const buffer = e.data;
    // const hash = calculateHash256(buffer);
    const hash = "random hash .....";
    self.postMessage(hash);
  });
};
