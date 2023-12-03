import JSZip from "jszip";
import { saveAs } from "file-saver";

const downloadDirectory = (zip, name) => {
  zip.generateAsync({ type: "blob" }).then((blob) => {
    saveAs(blob, name);
  });
};

const showFolderPicker = async () => {
  return await window.showDirectoryPicker();
};

const createZipFolder = () => {
  const zip = new JSZip();
  return zip;
};

export { showFolderPicker, createZipFolder, downloadDirectory };
