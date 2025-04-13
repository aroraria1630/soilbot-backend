import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { crop } = req.body;

  if (!crop) {
    return res.status(400).json({ error: 'Crop is required' });
  }

  try {
    const filePath = path.resolve(process.cwd(), 'cropData.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const crops = JSON.parse(data);

    const advice = crops[crop.toLowerCase()];

    if (advice) {
      res.status(200).json({ advice });
    } else {
      res.status(200).json({ advice: 'Sorry, no advice available.' });
    }
  } catch (error) {
    console.error('Error reading crop data:', error);
    res.status(500).json({ error: 'Failed to read crop data' });
  }
}
