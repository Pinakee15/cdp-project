const showFolderPicker = async () => {
  return await window.showDirectoryPicker({ mode: "readwrite" });
};

export default showFolderPicker;
