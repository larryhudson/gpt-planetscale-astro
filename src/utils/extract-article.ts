import cheerio from "cheerio";
import { extract } from "@extractus/article-extractor";



export async function getArticleFromUrl(url: string) {
  const article = await extract(url, {});
  if (!article) {
    console.log("Couldn't extract article, using fallback approach");
    return await getTitleAndContentFromUrl(url);
  }
  return article;
}

export async function getTitleAndContentFromUrl(url: string) {
  // fetch HTML from the URL, and then use cheerio to get the text content of the main element
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  const title = $("title").text();
  const contentSelectors = [
    "main",
    "#content",
    "#main",
    ".content",
    ".main",
    ".article",
    ".post",
    ".entry",
    ".body",
    ".article-body",
    ".post-body",
    ".entry-content",
    ".body-copy",
    ".article-content",
    ".post-content",
    "body",
  ];
  // find first element that matches one of the selectors
  let content = null;
  for (const selector of contentSelectors) {
    content = $(selector).text();
    if (content) {
      break;
    }
  }

  return {
    title,
    content,
  };
}
