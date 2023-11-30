import React from "react";
import { v4 as uuidv4 } from "uuid";

const FilePicker = () => {
  const handlePickFolder = async () => {
    const directoryHandle = await window.showDirectoryPicker();
    const mainPicture = [];
    const mainSound = [];
    const mainSubtitle = [];
    const allowedFileTypes = [
      "video/mp4",
      "audio/mpeg",
      "audio/mp3",
      "text/plain",
    ];
    for await (const [name, entry] of directoryHandle.entries()) {
      try {
        const file = await entry.getFile();
        if (allowedFileTypes.includes(file.type)) {
          const fileSize = file.size;
          const chunkSize = 10; // Number of chunks

          const chunkSizeInBytes = Math.ceil(fileSize / chunkSize);
          for (let i = 0; i < chunkSize; i++) {
            const offset = i * chunkSizeInBytes;
            const end = Math.min(offset + chunkSizeInBytes, fileSize);
            const blobChunk = file.slice(offset, end);
            const reader = new FileReader();

            reader.onload = async function () {
              const fileContent = reader.result;
              const hash = await calculateHash(fileContent);
              const chunkUUID = uuidv4();
              let chunkFile = {
                [`${name}_part${i + 1}`]: fileContent,
                hash,
                chunkUUID,
              };
              if (file.type === "video/mp4") {
                const path = `highsmpte-reel-${i}-jp2k.mxf`;
                mainPicture.push({ ...chunkFile, path, annotationText: path });
              } else if (file.type === "text/plain") {
                const path = `highsmpte-reel-${i}-pcm.mxf`;
                mainSubtitle.push({ ...chunkFile, path, annotationText: path });
              } else {
                const path = `highsmpte-reel-${i}.mxf`;
                mainSound.push({ ...chunkFile, path, annotationText: path });
              }
            };

            reader.onerror = function (err) {
              console.error(`Error reading ${name}:`, err);
            };

            reader.readAsArrayBuffer(blobChunk);
          }
        } else continue;
      } catch (err) {
        console.error(`Error fetching ${name}:`, err);
        throw new Error("Some error occurred");
      }
    }
    return { mainPicture, mainSound, mainSubtitle };
  };

  const calculateHash = async (data) => {
    const buffer = data;
    const hash = await crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const generateCDP = async () => {
    const { mainPicture, mainSound, mainSubtitle } = await handlePickFolder();
    console.log({ mainPicture, mainSound, mainSubtitle }, "finally");
  };

  return (
    <div>
      <button onClick={generateCDP}>Select Folder</button>
    </div>
  );
};

export default FilePicker;
