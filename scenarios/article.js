import http from "k6/http";
import { check, group } from "k6";
import { ArticleRoutes, GetRandomArticleName } from "../routes/articleRoute.js";

export function ArticleScenarioInit() {
  AccessArticlePages();
  AccessRandomArticle();
}

export function AccessArticlePages() {
  ArticleRoutes.forEach((route) => {
    group(`Access ${route.url}`, () => {
      let res = http.get(`${__ENV.HOST_URL}${route.url}`);
      check(res, {
        "status is 200": (r) => r.status === 200,
        // "body is present": (r) => r.body.includes(route.bodyHtml),
      });
    });
  });
}

export function AccessRandomArticle() {
  group("Access Random Article", () => {
    // Randomly select a locale
    const locales = ["id", "en"];
    const randomLocale = locales[Math.floor(Math.random() * locales.length)];

    // Generate a random article name based on the locale
    const randomArticleName = GetRandomArticleName(randomLocale);

    // Construct the URL based on the locale
    const basePath = randomLocale === "id" ? "berita" : "news";
    const url = `${__ENV.HOST_URL}/${basePath}/${randomArticleName}`;

    // Perform the request
    const res = http.get(url);

    // Validate the response
    check(res, {
      "status is 200": (r) => r.status === 200,
      //   "body is present": (r) => r.body.includes(randomArticleName),
    });
  });
}
