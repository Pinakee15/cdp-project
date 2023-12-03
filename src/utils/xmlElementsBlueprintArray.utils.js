import CONFIG from "../config/config";
import { dateToISO8601Format } from "./time.utils";

const createAssetMapBlueprintArray = ({
  id,
  annotationText,
  volumeCount = 1,
  assetList,
}) => {
  const AssetList = assetList.map((asset) => {
    return {
      Asset: [
        { Id: `urn:uuid:${asset.id}` },
        { AnnotationText: asset.annotationText },
        { ChunkList: [{ Chunk: [{ Path: asset.path }] }] },
      ],
    };
  });
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

export { createAssetMapBlueprintArray };
