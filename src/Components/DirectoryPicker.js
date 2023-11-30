import React from "react";
import { v4 as uuidv4 } from "uuid";

const FilePicker = () => {
  const handlePickFolder = async () => {
    const directoryHandle = await window.showDirectoryPicker();
    for await (const [name, entry] of directoryHandle.entries()) {
      try {
        const file = await entry.getFile();
        const fileSize = file.size;
        const chunkSize = 10; // Number of chunks

        const chunks = [];
        const chunkSizeInBytes = Math.ceil(fileSize / chunkSize);
        console.log({ name });
        for (let i = 0; i < chunkSize; i++) {
          const offset = i * chunkSizeInBytes;
          const end = Math.min(offset + chunkSizeInBytes, fileSize);
          const blobChunk = file.slice(offset, end);
          const reader = new FileReader();

          reader.onload = async function () {
            const fileContent = reader.result;
            const hash = await calculateHash(fileContent);
            const chunkUUID = uuidv4();
            chunks.push({
              [`${name}_part${i + 1}`]: fileContent,
              hash,
              chunkUUID,
            });

            if (chunks.length === chunkSize) {
              console.log(`File ${name} divided into chunks:`, chunks);
            }
          };

          reader.onerror = function (err) {
            console.error(`Error reading ${name}:`, err);
          };

          reader.readAsArrayBuffer(blobChunk);
        }
      } catch (err) {
        console.error(`Error fetching ${name}:`, err);
      }
    }
  };

  const calculateHash = async (data) => {
    const buffer = data;
    const hash = await crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  return (
    <div>
      <button onClick={handlePickFolder}>Select Folder</button>
    </div>
  );
};

export default FilePicker;
