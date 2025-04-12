
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cropData = require("./cropData.json");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let currentMoisture = 420; // Simulated data for now

app.get("/moisture", (req, res) => {
  res.json({ moisture: currentMoisture });
});

app.post("/advice", (req, res) => {
  const { crop } = req.body;
  const cropInfo = cropData[crop.toLowerCase()];
  if (!cropInfo) {
    return res.status(400).json({ error: "Unknown crop." });
  }

  const { moisture_min, moisture_max } = cropInfo;
  let advice = "";

  if (currentMoisture < moisture_min) {
    advice = `Moisture is too low for ${crop}. Water it gently.`;
  } else if (currentMoisture > moisture_max) {
    advice = `Moisture is too high for ${crop}. Improve drainage or let it dry.`;
  } else {
    advice = `Perfect moisture for ${crop}! 🌱`;
  }

  res.json({ advice, moisture: currentMoisture });
});

app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));
