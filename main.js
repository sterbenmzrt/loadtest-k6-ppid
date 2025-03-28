import { accessHome } from "./scenarios/home.js";

export const options = {
  vus: 10,
  duration: '10s',
};

export default function() {
  accessHome();
}
