const rules = [
  { ID: "iddddd" },
  { ANNOT: "annot val" },
  {
    ASSETLIST: [
      {
        ASSET: [
          { ID: "ASSET ID" },
          { CHUNKLIST: [{ CHUNK: [{ PATH: "CHUNK PATH" }] }] },
        ],
      },
      {
        ASSET: [
          { ID: "ASSET ID2" },
          { CHUNKLIST: [{ CHUNK: [{ PATH: "CHUNK PATH2" }] }] },
        ],
      },
    ],
  },
];

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

  // Rules
  const rules = [
    { ID: "iddddd" },
    { ANNOT: "annot val" },
    {
      ASSETLIST: [
        {
          ASSET: [
            { ID: "ASSET ID" },
            { CHUNKLIST: [{ CHUNK: [{ PATH: "CHUNK PATH" }] }] },
          ],
        },
        {
          ASSET: [
            { ID: "ASSET ID2" },
            { CHUNKLIST: [{ CHUNK: [{ PATH: "CHUNK PATH2" }] }] },
          ],
        },
      ],
    },
  ];

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
