export const ArticleRoutes = [
  {
    url: "/en/news",
    method: "GET",
    bodyHtml: "Peraturan Perundang-undangan",
    },
  {
    url: "/id/berita",
    method: "GET",
    bodyHtml: "Peraturan Perundang-undangan",
  },
];

const idArticleNames = JSON.parse(open(`../data/post_slug_id.json`));
const enArticleNames = JSON.parse(open(`../data/post_slug_en.json`));

export function GetRandomArticleName(locale) {
    if (!locale || typeof locale !== "string" || locale != "en" && locale != "id") {
        throw new Error("Invalid locale. Expected 'en' or 'id'.");
    }
    const articleNames = locale === "id" ? idArticleNames : enArticleNames;

    const randomIndex = Math.floor(Math.random() * articleNames.length);
    return articleNames[randomIndex];
}