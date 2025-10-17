import express from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json()); // parse JSON body

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../client')));  // or wherever your files live

// Handle talon-secret subdomain
app.get('/talon-secret', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/pages/talon/talon-secret/talon-secret-page.html'));
});

// Handle talon-secret subdomain with any path
app.get('/talon-secret/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/pages/talon/talon-secret/talon-secret-page.html'));
});

app.post('/api/submit', async (req, res) => {
  try {
    const { challenge, answer } = req.body;

    if (!challenge || !answer) {
      return res.status(400).json({ success: false, message: 'Missing challenge or answer' });
    }

    // Build env var name dynamically: FLAG1_HASH, FLAG2_HASH, ...
    const envVarName = `FLAG${challenge}_HASH`;
    let flagHash = process.env[envVarName];
    
    // Fallback to hardcoded flags if env vars not set
    if (!flagHash) {
      const hardcodedFlags = {
        '1': '$2b$10$kNqcRlTJ9RuxEqtM6LAkk.QZN08oMROSbSl7XG.hubpGNFXwYwkam' // TALON{hidden_in_plain_sight_1337}
      };
      flagHash = hardcodedFlags[challenge];
    }

    if (!flagHash) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    // Compare submitted answer with stored hash
    const isMatch = await bcrypt.compare(answer, flagHash);

    if (isMatch) {
      return res.json({ success: true, message: 'Correct flag!' });
    } else {

      return res.status(401).json({ success: false, message: 'Incorrect flag.' });
    }

  } catch (error) {
    console.error('Error verifying flag:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start server, etc...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
