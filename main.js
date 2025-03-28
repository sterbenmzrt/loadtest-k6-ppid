import { accessHome } from "./scenarios/home.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { generateTimestamp } from "./utils/helper.js";

export const options = {
  vus: 10,
  duration: '5s',
};

export default function() {
  accessHome();
}

export function handleSummary(data) {
  const timestamp = generateTimestamp(); 
  const filename = `reports/html/summary-${timestamp}.html`;

  return {
    [filename]: htmlReport(data), 
  };
}
