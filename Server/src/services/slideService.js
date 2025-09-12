import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

export const generateSlides = async (points) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"]
  });

  const outputDir = path.join("outputs");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const templatePath = path.join("src", "template", "slideTemplate.html");
  const templateHtml = fs.readFileSync(templatePath, "utf-8");

  const slidePaths = [];

  for (let i = 0; i < points.length; i++) {
    const page = await browser.newPage();
    const slideHtml = templateHtml.replace("{{TEXT}}", points[i]);
    await page.setContent(slideHtml, { waitUntil: "domcontentloaded" });
    const filePath = path.join(outputDir, `slide-${i + 1}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    slidePaths.push(filePath);
    await page.close();
  }

  await browser.close();
  return slidePaths;
};
