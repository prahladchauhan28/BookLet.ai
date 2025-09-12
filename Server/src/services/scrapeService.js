import puppeteer from "puppeteer";
import { cleanText } from "../utils/textCleaner.js";

export const scrapePage = async (url) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Extract <title> and main text
  const data = await page.evaluate(() => {
    const title = document.title || "Untitled";
    const paragraphs = Array.from(document.querySelectorAll("p"));
    const text = paragraphs.map(p => p.innerText).join("\n");
    return { title, text };
  });

  await browser.close();

  return { title: data.title, content: cleanText(data.text) };
};
