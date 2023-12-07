import { v4 as uuidv4 } from "uuid";
import { showFolderPicker } from "../services/files.service";
import WebWorker from "../WebWorker";
import getFileMetaWorker from "../workers/get-file-meta.worker";

const createWorker = (file) => {
  const webWorker = new WebWorker(getFileMetaWorker);
  webWorker.postMessage(file);
  return webWorker;
};

// Function to handle hashing in parallel
const createFilesMeta = (files) => {
  const maxWorkers = navigator.hardwareConcurrency || 4;
  const promises = [];
  const hashes = [];

  let workersCount = 0;
  let currentIndex = 0;

  // Create workers to process files in parallel
  const createWorkers = () => {
    while (workersCount < maxWorkers && currentIndex < files.length) {
      const file = files[currentIndex];
      const worker = createWorker(file);
      workersCount++;
      currentIndex++;
      promises.push(
        new Promise((resolve) => {
          worker.onmessage = function (e) {
            console.log("Message from web worker : ", e.data);
            hashes.push(e.data);
            workersCount--;
            resolve();
          };
        })
      );
    }
  };

  // Start processing files
  createWorkers();

  // Handle worker completion and continue processing until all files are hashed
  return Promise.all(promises).then(() => {
    if (currentIndex < files.length) {
      return createWorkers();
    }
    return hashes;
  });
};

const generateAssetMetaData = async (chunkSize = 8, allowedFileTypes) => {
  const directoryHandle = await showFolderPicker();
  const mainPicture = [];
  const mainSound = [];
  const mainSubtitle = [];

  try {
    const entries = await directoryHandle.entries();
    const files = [];

    for await (const [_, entry] of entries) {
      const file = await entry.getFile();
      files.push(file);
    }

    const filesMeta = await createFilesMeta(files);

    filesMeta.forEach((file) => {
      if (file.type === "video/mp4") {
        mainPicture.push(file);
      } else if (file.type === "text/plain") {
        mainSubtitle.push(file);
      } else {
        mainSound.push(file);
      }
    });

    return {
      mainPicture,
      mainSound,
      mainSubtitle,
      directoryName: directoryHandle.name,
    };
  } catch (err) {
    console.error("Error fetching entries:", err);
    throw new Error("Some error occurred");
  }

  // ---- END -----

  // for await (const [name, entry] of entries) {
  //   try {
  //     const file = await entry.getFile();
  //     if (allowedFileTypes.includes(file.type)) {
  //       const fileSize = file.size;
  //       const chunkSizeInBytes = Math.ceil(fileSize / chunkSize);
  //       const chunkPromises = [];

  //       for (let i = 0; i < chunkSize; i++) {
  //         const offset = i * chunkSizeInBytes;
  //         const end = Math.min(offset + chunkSizeInBytes, fileSize);
  //         const blobChunk = file.slice(offset, end);

  //         const promise = new Promise((resolve, reject) => {
  //           const reader = new FileReader();

  //           reader.onload = async function () {
  //             try {
  //               const fileContent = reader.result;
  //               const hash = await calculateHash(fileContent);
  //               const id = uuidv4();
  //               let chunkFile = {
  //                 [`${name}_part${i + 1}`]: fileContent,
  //                 hash,
  //                 id,
  //                 size: chunkSizeInBytes,
  //                 type: "application/mxf",
  //               };
  //               if (file.type === "video/mp4") {
  //                 const path = `highsmpte-reel-${i + 1}-jp2k.mxf`;
  //                 mainPicture.push({
  //                   ...chunkFile,
  //                   path,
  //                   annotationText: path,
  //                 });
  //               } else if (file.type === "text/plain") {
  //                 const path = `highsmpte-reel-${i + 1}-pcm.mxf`;
  //                 mainSubtitle.push({
  //                   ...chunkFile,
  //                   path,
  //                   annotationText: path,
  //                 });
  //               } else {
  //                 const path = `highsmpte-reel-${i + 1}.mxf`;
  //                 mainSound.push({
  //                   ...chunkFile,
  //                   path,
  //                   annotationText: path,
  //                 });
  //               }
  //               resolve();
  //             } catch (err) {
  //               reject(err);
  //             }
  //           };

  //           reader.onerror = function (err) {
  //             reject(`Error reading ${name}: ${err}`);
  //           };

  //           reader.readAsArrayBuffer(blobChunk);
  //         });

  //         chunkPromises.push(promise);
  //       }

  //       promises.push(Promise.all(chunkPromises));
  //     }
  //   } catch (err) {
  //     console.error(`Error fetching ${name}: ${err}`);
  //     throw new Error("Some error occurred");
  //   }
  // }

  // await Promise.all(promises);
};

export default generateAssetMetaData;
