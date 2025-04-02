import http from "k6/http";
import { check } from "k6";

export function AdminScenarioInit(){
    AccessAdmin();
    AccessAdminAbout();
}

export function AccessAdmin(){
    let res = http.get(`${__ENV.HOST_URL}/admin`);
    check(res, { "status is 200": (r) => r.status === 200 });
}

export function AccessAdminAbout(){
    let res = http.get(`${__ENV.HOST_URL}/admin/about`);
    check(res, { "status is 200": (r) => r.status === 200 });
}