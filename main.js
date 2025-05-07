import { ArticleScenarioInit } from "./scenarios/article.js";
import { DocumentScenarioInit } from "./scenarios/document.js";
import { HomeScenarioInit } from "./scenarios/home.js";
import { generateSummaryReport } from "./utils/generateHtml.js";

const maxVU = parseInt(__ENV.MAX_VU) || 20; // Default to 20 if MAX_VU is not set

const stages = [
  { duration: "5s", target: Math.floor(maxVU * 0.25) }, // Ramp up to 25% of max VUs
  { duration: "10s", target: Math.floor(maxVU * 0.5) }, // Stay at 50% of max VUs
  { duration: "10s", target: maxVU }, // Ramp up to max VUs
  { duration: "5s", target: maxVU }, // Hold at max VUs
  { duration: "10s", target: Math.floor(maxVU * 0.25) }, // Ramp down to 25% of max VUs
  { duration: "5s", target: 0 }, // Gradually stop all VUs
];

export const options = {
  stages:stages ,
  discardResponseBodies: true, // Avoid storing large files in memory
};

export default function () {
  HomeScenarioInit();
  DocumentScenarioInit();
  ArticleScenarioInit();
}


export function handleSummary(data) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `reports/html/summary-${timestamp}.html`;

  console.log(data);

  const html = generateSummaryReport(data, timestamp, filename,stages);

  // Return HTML summary
  return {
    [filename]: html,
  };
}

