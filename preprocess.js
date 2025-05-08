// preprocess.js
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data/post_slug_id.csv");
const fileContent = fs.readFileSync(filePath, "utf-8");

const names = fileContent
  .split("\n")
  .map((name) => name.trim())
  .filter(Boolean);

const outputPath = path.join(__dirname, "data/post_slug_id.json");
fs.writeFileSync(outputPath, JSON.stringify(names, null, 2));

console.log("CSV file has been converted to JSON!");
