import puppeteer from 'puppeteer';
import JSZip from 'jszip';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';

export const exportSlides = async (req, res) => {
  const { slides, format = 'zip' } = req.body;

  if (!slides || !Array.isArray(slides) || slides.length === 0) {
    return res.status(400).json({ message: 'No slides provided' });
  }

  const sessionId = uuidv4();
  const exportDir = path.join('exports', sessionId);
  await fs.ensureDir(exportDir);

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1350 });
    page.setDefaultNavigationTimeout(0); // Disable timeout

    const images = [];

    for (let i = 0; i < slides.length; i++) {
      const html = slides[i];
      const slidePath = path.join(exportDir, `slide-${i + 1}.png`);

      await page.setContent(html, {
        waitUntil: 'domcontentloaded',
        timeout: 0
      });

      // small delay to let styles/rendering settle
      await new Promise(resolve => setTimeout(resolve, 500));

      await page.screenshot({ path: slidePath, type: 'png' });

      // Add watermark using Sharp
      const watermarkedBuffer = await sharp(slidePath)
        .composite([
          {
            input: Buffer.from(
              `<svg width="1080" height="1350">
                 <text x="800" y="1300" font-size="14" fill="rgba(0, 0, 0, 0.5)">
                   Booklet.AI
                 </text>
               </svg>`
            ),
            gravity: 'southeast'
          }
        ])
        .png()
        .toBuffer();

      await fs.writeFile(slidePath, watermarkedBuffer);
      images.push({ name: `slide-${i + 1}.png`, buffer: watermarkedBuffer });
    }

    await browser.close();

    if (format === 'zip') {
      const zip = new JSZip();
      images.forEach(img => zip.file(img.name, img.buffer));

      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      const zipPath = path.join(exportDir, 'slides.zip');
      await fs.writeFile(zipPath, zipBuffer);

      res.download(zipPath, 'slides.zip', async () => {
        await fs.remove(exportDir);
      });
    } else if (format === 'pdf') {
      const pdfDoc = await PDFDocument.create();

      for (const img of images) {
        const pngImage = await pdfDoc.embedPng(img.buffer);
        const pdfPage = pdfDoc.addPage([1080, 1350]);
        pdfPage.drawImage(pngImage, {
          x: 0,
          y: 0,
          width: 1080,
          height: 1350
        });
      }

      const pdfBytes = await pdfDoc.save();
      const pdfPath = path.join(exportDir, 'slides.pdf');
      await fs.writeFile(pdfPath, pdfBytes);

      res.download(pdfPath, 'slides.pdf', async () => {
        await fs.remove(exportDir);
      });
    } else {
      return res.status(400).json({ message: 'Invalid format. Use zip or pdf.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Export failed', error: err.message });
  }
};
