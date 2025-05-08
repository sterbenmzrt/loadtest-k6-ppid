import http from "k6/http";
import { check, group } from "k6";
import { GetRandomDocumentName } from "../routes/documentRoute.js";

export function DocumentScenarioInit() {
  DownloadLawDocuments();
}

export function DownloadLawDocuments() {
  group("Download Random Law Document", () => {
    // Generate a random document name
    const randomDocumentName = GetRandomDocumentName();

    // Construct the URL
    const url = `${__ENV.HOST_URL}/storage/${randomDocumentName}`;

    // Perform the download request
    const res = http.get(url, { responseType: "binary" });

    // Validate the response
    check(res, {
      "status is 200": (r) => r.status === 200,
      "Content-Type is PDF": (r) =>
        r.headers["Content-Type"] === "application/pdf",
    });
  });
}