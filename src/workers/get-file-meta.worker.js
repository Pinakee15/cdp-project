/* eslint-env worker */

/* eslint-disable no-restricted-globals */

export default () => {
  self.addEventListener("message", function (e) {
    if (!e) return;
    const file = e.data;
    const reader = new FileReaderSync();
    const buffer = reader.readAsArrayBuffer(file);
    const fileMeta = {};

    crypto.subtle
      .digest("SHA-256", buffer)
      .then((hash) => {
        const hashString = Array.from(new Uint8Array(hash))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        self.postMessage(hashString);
      })
      .catch((error) => {
        console.error("Error calculating hash:", error);
      });
  });
};
