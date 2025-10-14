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

app.post('/api/submit', async (req, res) => {
  try {
    const { challenge, answer } = req.body;

    if (!challenge || !answer) {
      return res.status(400).json({ success: false, message: 'Missing challenge or answer' });
    }

    // Build env var name dynamically: FLAG1_HASH, FLAG2_HASH, ...
    const envVarName = `FLAG${challenge}_HASH`;
    const flagHash = process.env[envVarName];

    if (!flagHash) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    // Compare submitted answer with stored hash
    const isMatch = await bcrypt.compare(answer, flagHash);

    if (isMatch) {
      return res.json({ success: true, message: 'Correct flag!' });
    } else {
      console.log('FLAG1_HASH from env:', process.env.FLAG1_HASH);
      console.log(answer, flagHash)
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
