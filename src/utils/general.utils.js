const generateCDPFolderName = (name) => {
  const dirName =
    name.split(" ").join("_") +
    "_v1_" +
    "_2D_" +
    `${new Date().getMilliseconds()}`;
  return dirName;
};

const calculateHash256 = async (buffer) => {
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export { generateCDPFolderName, calculateHash256 };
