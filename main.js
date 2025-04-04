import { DocumentScenarioInit } from "./scenarios/document.js";
import { HomeScenarioInit } from "./scenarios/home.js";
import { generateSummaryReport } from "./utils/generateHtml.js";

const stages = [
    { duration: "5s", target: 5 }, // Ramp up to 5 VUs over 30 seconds
    { duration: "10", target: 10 }, // Stay at 10 VUs for 1 minute
    { duration: "10s", target: 20 }, // Ramp up to 20 VUs over 30 seconds
    { duration: "5", target: 20 }, // Hold at 20 VUs for 1 minute
    { duration: "10s", target: 5 }, // Ramp down to 5 VUs over 30 seconds
    { duration: "5s", target: 0 }, // Gradually stop all VUs over 30 seconds
  ];

export const options = {
  stages:stages ,
  discardResponseBodies: true, // Avoid storing large files in memory
};

export default function () {
  // HomeScenarioInit();
  DocumentScenarioInit();
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

