const documentNames = JSON.parse(open("../data/document_name.json"));

export function GetRandomDocumentName() {
  const randomIndex = Math.floor(Math.random() * documentNames.length);
  return documentNames[randomIndex];
}
