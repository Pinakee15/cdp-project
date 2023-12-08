import { v4 as uuidv4 } from "uuid";
import WebWorker from "../WebWorker";
import hashFileWorker from "../workers/hash-file.worker";

const createFilesHash = async (files) => {
  const maxWorkers = navigator.hardwareConcurrency || 4;
  let globalHashes = [];
  let currentIndex = 0;

  const createWorker = (file) => {
    const webWorker = new WebWorker(hashFileWorker);
    webWorker.postMessage(file);
    return webWorker;
  };

  const processFile = async (file) => {
    return new Promise((resolve) => {
      const worker = createWorker(file);
      worker.onmessage = function (e) {
        if (e.data.success) {
          globalHashes.push(e.data?.message);
          resolve();
        } else {
          throw new Error(e.data?.message);
        }
      };
    });
  };

  const processNext = async () => {
    const workers = [];
    while (currentIndex < files.length && workers.length < maxWorkers) {
      workers.push(processFile(files[currentIndex]));
      currentIndex++;
    }
    await Promise.all(workers);
  };

  const processAllFiles = async () => {
    while (currentIndex < files.length) {
      await processNext();
    }
  };

  await processAllFiles();
  return globalHashes;
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
