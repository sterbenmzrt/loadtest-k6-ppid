import http from "k6/http";
import { check, group } from "k6";
import { HomeRoutes } from "../routes/homeRoute.js";

export function HomeScenarioInit(){
  AccessHome();
}

export function AccessHome() {
  HomeRoutes.forEach(route => {
    group(route.url, () => {
      let res = http.get(
        `${__ENV.HOST_URL}${route.url}`
      );
      check(res, 
        { 
          "status is 200": (r) => r.status === 200,
          "body is present": (r) => r.body.includes(route.bodyHtml),
          "transaction time not more than 500ms": (r) => r.timings.duration > 500
        });
    });
    });
}
