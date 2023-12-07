import CONFIG from "../config/config";
import { dateToISO8601Format } from "./time.utils";
import { v4 as uuidv4 } from "uuid";

const createXMLElementsBlueprintArray = ({
  id,
  annotationText,
  volumeCount = 1,
  assetList,
  type,
  dirName,
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
    AssetList.unshift({
      Asset: [
        { Id: `urn:uuid:${uuidv4()}` },
        { AnnotationText: dirName },
        { ChunkList: [{ Chunk: [{ Path: `${dirName}.cpl.xml` }] }] },
      ],
    });
    console.log("FINAL LIST : ", AssetList);
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
