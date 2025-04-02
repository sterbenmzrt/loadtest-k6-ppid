import http from "k6/http";
import { check } from "k6";
import { DocumentRoutes } from "../routes/documentRoute.js";

export function DocumentScenarioInit() {
  AccessLawDocuments();
}

export function AccessLawDocuments() {
  DocumentRoutes.forEach(route => {    
    let res = http.get(
      `${__ENV.HOST_URL}${route.url}`
    );
    check(res, 
      { 
        "status is 200": (r) => r.status === 200,
        "body is present": (r) => r.body.includes(route.bodyHtml),
      });
  });
}
