import http from "k6/http";
import { check } from "k6";

export function accessHome() {
  let res = http.get(`${__ENV.HOST_URL}`);
  check(res, { "status is 200": (r) => r.status === 200 });
}
