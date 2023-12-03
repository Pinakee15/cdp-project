import { createAssetMapBlueprintArray } from "../utils/xmlElementsBlueprintArray.utils";
import { v4 as uuidv4 } from "uuid";

// Function to convert XML document to string
function convertXMLToString(xmlDoc) {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(xmlDoc);
}

// Function to create an XML element with a namespace
function createElementWithNS(doc, namespace, elementName) {
  return doc.createElementNS(namespace, elementName);
}

// Function to create the XML document
const createXMLElements = (xmlDoc, parentElement, node) => {
  const nodeKey = Object.keys(node)[0];
  const nodeVal = node[nodeKey];
  const newEle = createElementWithNS(
    xmlDoc,
    "http://www.smpte-ra.org/schemas/429-9/2007/AM",
    nodeKey
  );
  if (Array.isArray(nodeVal)) {
    for (let node of nodeVal) {
      createXMLElements(xmlDoc, newEle, node);
    }
  } else {
    newEle.textContent = nodeVal;
  }
  parentElement.appendChild(newEle);
};

const generateXMLContent = (assetData, type) => {
  let namespace, tagName;
  if (type === "ASSETMAP") {
    namespace = "http://www.smpte-ra.org/schemas/429-9/2007/AM";
    tagName = "AssetMap";
  }
  // Generate the root element and document
  const xmlDoc = document.implementation.createDocument(
    namespace,
    tagName,
    null
  );
  const assetMap = xmlDoc.documentElement;
  assetMap.setAttribute("xmlns", namespace);
  const id = `urn:uuid:${uuidv4()}`;
  const annotationText =
    "HighAssetCount_TST-2D_S_EN-XX_51_2K_ST_20210629_QCE_SMPTE_OV";
  const xmlEleNodesArray = createAssetMapBlueprintArray({
    id,
    annotationText,
    assetList: assetData,
  });

  for (let node of xmlEleNodesArray) {
    createXMLElements(xmlDoc, assetMap, node);
  }

  // Convert XML document to string
  const xmlString = convertXMLToString(xmlDoc);

  // Display the generated XML string (you can use it further as needed)
  return `<?xml version="1.0" encoding="UTF-8"?>${xmlString}`;
};

export default generateXMLContent;
