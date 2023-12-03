import "./App.css";

import React from "react";
import generateAssetMetaData from "./utils/generateAssetMetaData.utils";
import CONFIG from "./config/config";
import generateXMLContent from "./services/generateXML.service";
import { createZipFolder, downloadDirectory } from "./services/files.service";

function App() {
  const generateDCPDirectory = (assetsData) => {
    const zip = createZipFolder();
    const xmlContent1 = generateXMLContent(assetsData, "ASSETMAP");
    const folder = zip.folder("xml_files");
    folder.file("ASSETMAP.xml", xmlContent1);
    downloadDirectory(zip, "xml_files.zip");
  };

  const handleGenerateDCP = async () => {
    const { mainPicture, mainSound, mainSubtitle } =
      await generateAssetMetaData(
        CONFIG.NO_OF_CHUNK_FILES,
        CONFIG.ALLOWED_FILE_TYPES
      );
    const assetsData = [...mainPicture, ...mainSound, ...mainSubtitle];
    generateDCPDirectory(assetsData);
    console.log({ mainPicture, mainSound, mainSubtitle }, "finally");
  };

  return (
    <div className="App">
      <div>Upload document</div>
      {/* <button onClick={generateDCPDirectory}>Download file</button> */}
      <button onClick={handleGenerateDCP}>Select Folder</button>
    </div>
  );
}

export default App;
