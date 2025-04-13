import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { crop, moisture } = req.body;

  if (!crop) {
    return res.status(400).json({ error: 'Crop is required' });
  }

  try {
    const filePath = path.resolve(process.cwd(), 'cropData.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const crops = JSON.parse(data);

    const cropInfo = crops[crop.toLowerCase()];

    if (!cropInfo) {
      return res.status(404).json({ advice: 'Sorry, no advice available for this crop.' });
    }

    let message = `Recommended soil moisture for ${crop} is between ${cropInfo.moisture_min} and ${cropInfo.moisture_max} units.`;

    if (moisture !== undefined) {
      if (moisture < cropInfo.moisture_min) {
        message += ' Current moisture is too low. Consider irrigation.';
      } else if (moisture > cropInfo.moisture_max) {
        message += ' Current moisture is too high. Consider drainage.';
      } else {
        message += ' Current moisture is optimal!';
      }
    }

    res.status(200).json({ advice: message });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong on the server.' });
  }
}
