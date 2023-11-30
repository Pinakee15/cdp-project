import "./App.css";
import FilePicker from "./Components/DirectoryPicker";

import React from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function App() {
  // Function to create an XML element with a namespace
  function createElementWithNS(doc, namespace, elementName) {
    return doc.createElementNS(namespace, elementName);
  }

  // Function to create the XML document
  function createXMLDocument() {
    const xmlDoc = document.implementation.createDocument(
      "http://www.smpte-ra.org/schemas/429-9/2007/AM",
      "AssetMap",
      null
    );

    const assetMap = xmlDoc.documentElement;
    assetMap.setAttribute(
      "xmlns",
      "http://www.smpte-ra.org/schemas/429-9/2007/AM"
    );

    // Create elements for AssetMap
    const id = createElementWithNS(
      xmlDoc,
      "http://www.smpte-ra.org/schemas/429-9/2007/AM",
      "Id"
    );
    id.textContent = "urn:uuid:b826188d-cb79-40bc-9980-19514fc21dc2";
    assetMap.appendChild(id);

    const annotationText = createElementWithNS(
      xmlDoc,
      "http://www.smpte-ra.org/schemas/429-9/2007/AM",
      "AnnotationText"
    );
    annotationText.textContent =
      "Assets of HighAssetCount_TST-2D_S_EN-XX_51_2K_ST_20210629_QCE_SMPTE_OV";
    assetMap.appendChild(annotationText);

    const creator = createElementWithNS(
      xmlDoc,
      "http://www.smpte-ra.org/schemas/429-9/2007/AM",
      "Creator"
    );
    creator.textContent = "QubeMaster Pro 3.0.1.5";
    assetMap.appendChild(creator);

    const volumeCount = createElementWithNS(
      xmlDoc,
      "http://www.smpte-ra.org/schemas/429-9/2007/AM",
      "VolumeCount"
    );
    volumeCount.textContent = "1";
    assetMap.appendChild(volumeCount);

    const assetList = createElementWithNS(
      xmlDoc,
      "http://www.smpte-ra.org/schemas/429-9/2007/AM",
      "AssetList"
    );

    // Sample asset list array
    const assets = [
      {
        id: "urn:uuid:568736d2-064f-479a-9e2d-09c1065842b2",
        annotationText:
          "HighAssetCount_TST-2D_S_EN-XX_51_2K_ST_20210629_QCE_SMPTE_OV",
        path: "HighAssetCount_TST-2D_S_EN-XX_51_2K_ST_20210629_QCE_SMPTE_OV.cpl.xml",
      },
      // Add other assets here...
    ];

    // Create assets and add them to the assetList
    assets.forEach((assetItem) => {
      const asset = createElementWithNS(
        xmlDoc,
        "http://www.smpte-ra.org/schemas/429-9/2007/AM",
        "Asset"
      );

      const assetId = createElementWithNS(
        xmlDoc,
        "http://www.smpte-ra.org/schemas/429-9/2007/AM",
        "Id"
      );
      assetId.textContent = assetItem.id;
      asset.appendChild(assetId);

      const assetAnnotationText = createElementWithNS(
        xmlDoc,
        "http://www.smpte-ra.org/schemas/429-9/2007/AM",
        "AnnotationText"
      );
      assetAnnotationText.textContent = assetItem.annotationText;
      asset.appendChild(assetAnnotationText);

      const chunkList = createElementWithNS(
        xmlDoc,
        "http://www.smpte-ra.org/schemas/429-9/2007/AM",
        "ChunkList"
      );
      const chunk = createElementWithNS(
        xmlDoc,
        "http://www.smpte-ra.org/schemas/429-9/2007/AM",
        "Chunk"
      );
      const path = createElementWithNS(
        xmlDoc,
        "http://www.smpte-ra.org/schemas/429-9/2007/AM",
        "Path"
      );
      path.textContent = assetItem.path;
      chunk.appendChild(path);
      chunkList.appendChild(chunk);
      asset.appendChild(chunkList);

      assetList.appendChild(asset);
    });

    assetMap.appendChild(assetList);

    return xmlDoc;
  }

  // Function to convert XML document to string
  function convertXMLToString(xmlDoc) {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
  }

  const generateXMLContent = (fileName, content) => {
    // Generate the XML document
    const xmlDocument = createXMLDocument();

    // Convert XML document to string
    const xmlString = convertXMLToString(xmlDocument);

    // Display the generated XML string (you can use it further as needed)
    return `<?xml version="1.0" encoding="UTF-8"?>${xmlString}`;
  };

  const downloadFile = () => {
    const zip = new JSZip();

    const xmlContent1 = generateXMLContent("File 1", "Content 1");
    const xmlContent2 = generateXMLContent("File 2", "Content 2");

    const folder = zip.folder("xml_files");
    folder.file("file1.xml", xmlContent1);
    folder.file("file2.xml", xmlContent2);

    zip.generateAsync({ type: "blob" }).then((blob) => {
      saveAs(blob, "xml_files.zip");
    });
  };

  return (
    <div className="App">
      <div>Upload document</div>
      <FilePicker />
      <button onClick={downloadFile}>Download file</button>
    </div>
  );
}

export default App;
