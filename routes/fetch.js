import express from 'express';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());
const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url || !url.includes('instagram.com'))
    return res.status(400).json({ message: 'Invalid Instagram URL' });

  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const result = await page.evaluate(() => {
      const meta = document.querySelector('meta[property="og:video"]') ||
                   document.querySelector('meta[property="og:image"]');
      const title = document.querySelector('title')?.innerText || 'Instagram Post';
      return { title, url: meta ? meta.content : null };
    });

    await browser.close();

    if (!result.url) return res.status(404).json({ message: 'Media not found' });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch media' });
  }
});

export default router;
