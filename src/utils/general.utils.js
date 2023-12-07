const generateCDPFolderName = (name) => {
  const dirName =
    name.split(" ").join("_") +
    "_v1_" +
    "_2D_" +
    `${new Date().getMilliseconds()}`;
  return dirName;
};

export { generateCDPFolderName };
