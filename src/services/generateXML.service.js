import CONFIG from "../config/config";
import { createXMLElementsBlueprintArray } from "../utils/xmlElementsBlueprintArray.utils";
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

// Function to create the XML document using recursion
const createXMLElements = (xmlDoc, parentElement, node, namespace) => {
  const nodeKey = Object.keys(node)[0];
  const nodeVal = node[nodeKey];
  const newEle = createElementWithNS(xmlDoc, namespace, nodeKey);
  if (Array.isArray(nodeVal)) {
    for (let node of nodeVal) {
      createXMLElements(xmlDoc, newEle, node);
    }
  } else {
    newEle.textContent = nodeVal;
  }
  parentElement.appendChild(newEle);
};

const generateXMLContent = (assetData, type, dirName) => {
  // Generate the root element and document
  const xmlDoc = document.implementation.createDocument(
    CONFIG.XML_META_INFO[type].NAMESPACE,
    CONFIG.XML_META_INFO[type].TAGNAME,
    null
  );
  const assetMap = xmlDoc.documentElement;
  assetMap.setAttribute("xmlns", CONFIG.XML_META_INFO[type].NAMESPACE);
  const id = `urn:uuid:${uuidv4()}`;
  const annotationText = dirName;
  const xmlEleNodesArray = createXMLElementsBlueprintArray({
    id,
    annotationText,
    assetList: assetData,
    type,
    dirName,
  });

  for (let node of xmlEleNodesArray) {
    createXMLElements(
      xmlDoc,
      assetMap,
      node,
      CONFIG.XML_META_INFO[type].NAMESPACE
    );
  }

  // Convert XML document to string
  const xmlString = convertXMLToString(xmlDoc);
  return `<?xml version="1.0" encoding="UTF-8"?>${xmlString}`;
};

export default generateXMLContent;
