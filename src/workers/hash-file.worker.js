/* eslint-env worker */

/* eslint-disable no-restricted-globals */

export default () => {
  self.addEventListener("message", function (e) {
    if (!e) return;
    const file = e.data;
    const reader = new FileReaderSync();
    const buffer = reader.readAsArrayBuffer(file);
    const data = {};

    try {
      crypto.subtle
        .digest("SHA-256", buffer)
        .then((hash) => {
          const hashString = Array.from(new Uint8Array(hash))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

          data["message"] = hashString;
          data["success"] = true;

          self.postMessage(data);
        })
        .catch((error) => {
          data["message"] = "Error hashing the file";
          data["success"] = false;
          self.postMessage(data);
          console.log("Error calculating hash:", error);
        });
    } catch (err) {
      data["message"] = "Error hashing the file";
      data["success"] = false;
      self.postMessage(data);
    }
  });
};
