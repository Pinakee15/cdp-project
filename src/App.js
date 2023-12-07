import "./App.css";
import React, { useState } from "react";
import generateAssetMetaData from "./utils/generateAssetMetaData.utils";
import CONFIG from "./config/config";
import generateXMLContent from "./services/generateXML.service";
import { createZipFolder, downloadDirectory } from "./services/files.service";
import Button from "./components/Button/Button";
import { generateCDPFolderName } from "./utils/general.utils";
import SnackBar from "./components/SnackBar/SnackBar";

function App() {
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const showMessageHandler = (showMessage) => {
    if (!message) {
      setShowMessage(false);
      return;
    }
    setShowMessage(showMessage);
  };

  const generateDCPDirectory = (assetsData, directoryName) => {
    try {
      const zip = createZipFolder();
      const assetmapXMLContent = generateXMLContent(assetsData, "ASSETMAP");
      const pklXMLContent = generateXMLContent(assetsData, "PKL");
      const DCPDirectoryName = generateCDPFolderName(directoryName);
      const folder = zip.folder(DCPDirectoryName);
      folder.file("ASSETMAP.xml", assetmapXMLContent);
      folder.file(`${DCPDirectoryName}.pkl.xml`, pklXMLContent);
      downloadDirectory(zip, DCPDirectoryName);
    } catch (err) {
      setMessage(
        `Some error occurred while generating or downloading xml content : ${err.message}`
      );
      setShowMessage(true);
    }
  };

  const handleGenerateDCP = async () => {
    try {
      const { mainPicture, mainSound, mainSubtitle, directoryName } =
        await generateAssetMetaData(
          CONFIG.NO_OF_CHUNK_FILES,
          CONFIG.ALLOWED_FILE_TYPES
        );
      return;
      let assetsData = [];
      for (let i = 0; i < CONFIG.NO_OF_CHUNK_FILES; i++) {
        if (mainPicture.length) {
          assetsData.push(mainPicture[i]);
        }
        if (mainSound.length) {
          assetsData.push(mainSound[i]);
        }
        if (mainSubtitle.length) {
          assetsData.push(mainSubtitle[i]);
        }
      }
      generateDCPDirectory(assetsData, directoryName);
    } catch (err) {
      setMessage(err.message);
      setShowMessage(true);
    }
  };

  return (
    <div className="App">
      <h1>Welcome to Qube cinema</h1>
      <h2>
        Please upload a folder containing (.mp4, .mp3 and .txt) files for video,
        audio and subtitle files respectively and convert it to DCP
      </h2>
      <Button
        handleGenerateDCP={handleGenerateDCP}
        ctaText={"Select folder and convert to DCP"}
      />

      {message && showMessage ? (
        <SnackBar message={message} showMessageHandler={showMessageHandler} />
      ) : null}
    </div>
  );
}

export default App;
