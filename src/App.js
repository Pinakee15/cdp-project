import "./App.css";
import React, { useState } from "react";
import generateAssetMetaData from "./utils/generateAssetMetaData.utils";
import CONFIG from "./config/config";
import generateXMLContent from "./services/generateXML.service";
import showFolderPicker from "./services/files.service";
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

  const generateDCPDirectory = async (assetsData, directoryHandle) => {
    const DCPDirectoryName = generateCDPFolderName(directoryHandle.name);
    const assetmapXMLContent = generateXMLContent(
      assetsData,
      "ASSETMAP",
      DCPDirectoryName
    );
    const pklXMLContent = generateXMLContent(
      assetsData,
      "PKL",
      DCPDirectoryName
    );
    const fileData = [
      {
        name: "ASSETMAP.xml",
        content: assetmapXMLContent,
      },
      {
        name: `${DCPDirectoryName}.pkl.xml`,
        content: pklXMLContent,
      },
    ];
    fileData.forEach(async (file) => {
      const fileHandle = await directoryHandle.getFileHandle(file.name, {
        create: true,
      });
      const writable = await fileHandle.createWritable();
      await writable.write(file.content);
      await writable.close();
    });
    setMessage({
      value: `DCP created and created in the same folder successfully`,
      variant: "success",
    });
    setShowMessage(true);
    return;
  };

  const handleGenerateDCP = async () => {
    try {
      const directoryHandle = await showFolderPicker();
      const { mainPicture, mainSound, mainSubtitle } =
        await generateAssetMetaData(CONFIG.ALLOWED_FILE_TYPES, directoryHandle);
      let assetsData = [];
      let individualAssetLength = mainPicture.length;
      for (let i = 0; i < individualAssetLength; i++) {
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

      generateDCPDirectory(assetsData, directoryHandle);
    } catch (err) {
      setMessage({
        value: `Some error occurred while generating or downloading xml content : ${err.message}`,
        variant: "error",
      });
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
