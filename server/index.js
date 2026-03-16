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

app.get('/pages/kharza/hidden-cookie/hidden-cookie.html', (req, res) => {
  res.cookie('session_token', 'KHARZA{cookies_are_not_so_hidden}', {
    path: '/'
  });

  res.sendFile(path.join(__dirname, '../client/pages/kharza/hidden-cookie/hidden-cookie.html'));
});

app.get('/api/article', (req, res) => {
  const pages = {
    '1': 'Article 1: Welcome to our content generator.',
    '2': 'Article 2: Nothing interesting here.',
    '3': 'Article 3: Keep refreshing for more content.',
    '4': 'Article 4: Another random article.',
    '5': 'Article 5: Just some placeholder content.',
    '6': 'Article 6: Still random, nothing special.',
    '7': 'Article 7: A fun little article to read.',
    '8': "Article 8: Maybe you'll find a secret?",
    '9': 'Article 9: Just some text to fill space.',
    '10': 'Article 10: Learning to look carefully is key.',
    '11': 'Article 11: The content keeps coming.',
    '12': 'Article 12: Keep trying new IDs.',
    '13': 'Article 13: Almost halfway through.',
    '14': 'Article 14: Still no secrets here.',
    '15': 'Article 15: Random filler text.',
    '16': 'Article 16: Maybe check the URL carefully.',
    '17': 'Article 17: Another ordinary article.',
    '18': 'Article 18: Nothing to see here.',
    '19': 'Article 19: Keep exploring!',
    '20': 'Article 20: Still normal content.',
    '21': 'Article 21: You might notice a pattern.',
    '22': 'Article 22: Almost at the end of normal articles.',
    '23': 'Article 23: Continue refreshing for more.',
    '24': 'Article 24: Random words keep you busy.',
    '25': 'Article 25: A simple placeholder article.',
    '26': 'Article 26: This is article number twenty-six.',
    '27': 'Article 27: Nothing exciting here.',
    '28': 'Article 28: Just some more text.',
    '29': 'Article 29: Keep looking at the URL IDs.',
    '30': 'Article 30: Last of the normal articles.',
    '0': 'Hidden Article: KHARZA{url_guessing_is_so_cool}'
  };

  const articleId = String(req.query.id ?? '');
  const article = pages[articleId];

  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }

  res.json({ content: article });
});

app.use(express.static(path.join(__dirname, '../client')));  // or wherever your files live

// Handle talon-secret subdomain
app.get('/talon-secret', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/pages/talon/talon-secret/talon-secret-page.html'));
});


app.post('/api/submit', async (req, res) => {
  try {
    const { challenge, answer } = req.body;

    if (!challenge || !answer) {
      return res.status(400).json({ success: false, message: 'Missing challenge or answer' });
    }

    // Build env var name dynamically: FLAG1_HASH, FLAG2_HASH, ...


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
