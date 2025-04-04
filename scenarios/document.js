import http from "k6/http";
import { check, group } from "k6";
import { DocumentRoutes, Documents } from "../routes/documentRoute.js";

export function DocumentScenarioInit() {
  AccessLawDocuments();
  DownloadLawDocuments();
}

export function AccessLawDocuments() {
  DocumentRoutes.forEach((route) => {
    group(`Access ${route.url}`, () => {
      let res = http.get(`${__ENV.HOST_URL}${route.url}`);
      check(res, {
        "status is 200": (r) => r.status === 200,
        // "body is present": (r) => r.body.includes(route.bodyHtml),
      });
    });
  });
}

export function DownloadLawDocuments() {
  Documents.forEach((document) => {
    group(`Download ${document.url}`, () => {
      // Simulate a delay to mimic real user behavior
      // sleep(Math.random() * 2); // Random sleep between 0 and 2 seconds

      // Perform the download request
      // let res = http.get(`${document.url}`, { responseType: "blob" });
      let res = http.get(`${document.url}`, { responseType: "binary" });
      check(res, {
        "status is 200": (r) => r.status === 200,
        "Content-Type is PDF": (r) =>
          r.headers["Content-Type"] === "application/pdf",
      });
    });
  });
}
