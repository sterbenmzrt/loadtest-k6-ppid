import { ArticleScenarioInit } from "./scenarios/article.js";
import { DocumentScenarioInit } from "./scenarios/document.js";
import { HomeScenarioInit } from "./scenarios/home.js";
import { generateSummaryReport } from "./utils/generateHtml.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const maxVU = parseInt(__ENV.MAX_VU) || 20; // Default to 20 if MAX_VU is not set
const maxDuration = parseInt(__ENV.MAX_DURATION) || 60; // Default to 60 seconds if MAX_DURATION is not set

const stages = [
  {
    duration: `${Math.floor(maxDuration * 0.2)}s`,
    target: Math.floor(maxVU * 0.5),
  }, // Ramp up to 50% of max VUs
  {
    duration: `${Math.floor(maxDuration * 0.3)}s`,
    target: Math.floor(maxVU * 0.5),
  }, // Hold at 50% of max VUs
  { duration: `${Math.floor(maxDuration * 0.2)}s`, target: maxVU }, // Ramp up to max VUs
  { duration: `${Math.floor(maxDuration * 0.2)}s`, target: maxVU }, // Hold at max VUs
  { duration: `${Math.floor(maxDuration * 0.1)}s`, target: 0 }, // Gradually stop all VUs
];

export const options = {
  stages: stages,
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<2000"],
  },
  summaryTrendStats: ["avg", "min", "med", "p(90)", "p(95)", "max"],
  discardResponseBodies: true,
};

export default function () {
  DocumentScenarioInit();
  HomeScenarioInit();
  ArticleScenarioInit();
}

export function handleSummary(data) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `reports/html/reports.html`;

  const html = generateSummaryReport(data, timestamp, filename, stages, maxDuration);

  // Return HTML summary
  return {
    [filename]: html,
    stdout: textSummary(data, { indent: "  " }), // Print the default summary to the terminal
  };
}
