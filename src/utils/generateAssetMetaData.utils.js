import { v4 as uuidv4 } from "uuid";
import WebWorker from "../WebWorker";
import hashFileWorker from "../workers/hash-file.worker";

const createWorker = (file) => {
  const webWorker = new WebWorker(hashFileWorker);
  webWorker.postMessage(file);
  return webWorker;
};

// Function to handle hashing in parallel
const createFilesHash = (files) => {
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

const generateAssetMetaData = async (allowedFileTypes, directoryHandle) => {
  const mainPicture = [];
  const mainSound = [];
  const mainSubtitle = [];

  try {
    const entries = await directoryHandle.entries();
    const files = [];

    for await (const [_, entry] of entries) {
      const file = await entry.getFile();
      if (allowedFileTypes.includes(file.type)) {
        files.push(file);
      }
    }

    const filesHashes = await createFilesHash(files);

    let videoIdx = 0;
    let audioIdx = 0;
    let subtitleIdx = 0;
    filesHashes.forEach((hash, idx) => {
      const file = files[idx];
      const id = uuidv4();
      const chunkFile = {
        hash,
        id,
        size: file.size,
        type: "application/mxf",
      };
      if (file.type === "video/mp4") {
        videoIdx++;
        const path = `highsmpte-reel-${videoIdx}-jp2k.mxf`;
        mainPicture.push({
          ...chunkFile,
          path,
          annotationText: path,
        });
      } else if (file.type === "text/plain") {
        subtitleIdx++;
        const path = `highsmpte-reel-${subtitleIdx}.mxf`;
        mainSubtitle.push({
          ...chunkFile,
          path,
          annotationText: path,
        });
      } else {
        audioIdx++;
        const path = `highsmpte-reel-${audioIdx}-pcm.mxf`;
        mainSound.push({
          ...chunkFile,
          path,
          annotationText: path,
        });
      }
    });

    return {
      mainPicture,
      mainSound,
      mainSubtitle,
    };
  } catch (err) {
    console.error("Error fetching entries:", err);
    throw new Error("Some error occurred");
  }
};

export default generateAssetMetaData;
