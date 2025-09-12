import puppeteer from 'puppeteer';
import JSZip from 'jszip';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PDFDocument } from 'pdf-lib';

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

    const images = [];

    // Render all slides to PNG
    for (let i = 0; i < slides.length; i++) {
      const html = slides[i];
      const slidePath = path.join(exportDir, `slide-${i + 1}.png`);

      await page.setContent(html, {
        waitUntil: 'domcontentloaded',
        timeout: 0 // disable timeout (infinite wait)
      });

      // small pause to let the content render
      await new Promise(r => setTimeout(r, 500));

      await page.screenshot({ path: slidePath, type: 'png' });

      const imgBuffer = await fs.readFile(slidePath);
      images.push({ name: `slide-${i + 1}.png`, buffer: imgBuffer });
    }

    await browser.close();

    if (format === 'zip') {
      // ZIP Export
      const zip = new JSZip();
      images.forEach(img => zip.file(img.name, img.buffer));

      const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
      const zipPath = path.join(exportDir, 'slides.zip');
      await fs.writeFile(zipPath, zipBuffer);

      res.download(zipPath, 'slides.zip', async () => {
        await fs.remove(exportDir);
      });
    } else if (format === 'pdf') {
      // PDF Export
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
