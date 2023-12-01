import { v4 as uuidv4 } from "uuid";
import { showFolderPicker } from "../services/files.service";

const generateAssetMetaData = async (chunkSize = 8, allowedFileTypes) => {
  const directoryHandle = await showFolderPicker();
  const mainPicture = [];
  const mainSound = [];
  const mainSubtitle = [];

  for await (const [name, entry] of directoryHandle.entries()) {
    try {
      const file = await entry.getFile();
      if (allowedFileTypes.includes(file.type)) {
        const fileSize = file.size;
        const chunkSizeInBytes = Math.ceil(fileSize / chunkSize);
        for (let i = 0; i < chunkSize; i++) {
          const offset = i * chunkSizeInBytes;
          const end = Math.min(offset + chunkSizeInBytes, fileSize);
          const blobChunk = file.slice(offset, end);
          const reader = new FileReader();

          reader.onload = async function () {
            const fileContent = reader.result;
            const hash = await calculateHash(fileContent);
            const id = uuidv4();
            let chunkFile = {
              [`${name}_part${i + 1}`]: fileContent,
              hash,
              id,
              size: chunkSizeInBytes,
              type: "application/mxf",
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
            throw new Error("Some error occurred");
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

export default generateAssetMetaData;
