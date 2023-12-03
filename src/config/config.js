const CONFIG = {
  ALLOWED_FILE_TYPES: ["video/mp4", "audio/mpeg", "audio/mp3", "text/plain"],
  NO_OF_CHUNK_FILES: 10,
  CREATOR: "QubeMaster Pro 3.0.1.5",
  ISSUER: "QUBECINEMA EUROPE",
  XML_META_INFO: {
    ASSETMAP: {
      NAMESPACE: "http://www.smpte-ra.org/schemas/429-9/2007/AM",
      TAGNAME: "AssetMap",
    },
    PKL: {
      NAMESPACE: "http://www.smpte-ra.org/schemas/429-8/2007/PKL",
      TAGNAME: "PackingList",
    },
  },
};
export default CONFIG;
