import CONFIG from "../config/config";
import { dateToISO8601Format } from "./time.utils";

const createXMLElementsBlueprintArray = ({
  id,
  annotationText,
  volumeCount = 1,
  assetList,
  type,
}) => {
  let AssetList = [];
  if (type === "ASSETMAP") {
    AssetList = assetList.map((asset) => {
      return {
        Asset: [
          { Id: `urn:uuid:${asset.id}` },
          { AnnotationText: asset.annotationText },
          { ChunkList: [{ Chunk: [{ Path: asset.path }] }] },
        ],
      };
    });
  } else if (type === "PKL") {
    AssetList = assetList.map((asset) => {
      return {
        Asset: [
          { Id: `urn:uuid:${asset.id}` },
          { AnnotationText: asset.annotationText },
          { Hash: asset.hash },
          { Size: asset.size },
          { Type: asset.type },
        ],
      };
    });
  } else {
    return [];
  }
  const xmlEleNodes = [
    { Id: id },
    { AnnotationText: `Assets of ${annotationText}` },
    { Creator: CONFIG.CREATOR },
    { VolumeCount: volumeCount },
    { IssueDate: dateToISO8601Format(new Date()) },
    { Issuer: CONFIG.ISSUER },
    { AssetList },
  ];
  return xmlEleNodes;
};

export { createXMLElementsBlueprintArray };
