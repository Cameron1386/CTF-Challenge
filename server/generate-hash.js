import bcrypt from 'bcrypt';

async function generateHash(flag) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(flag, saltRounds);
  console.log(`Flag: ${flag}`);
  console.log(`Hash: ${hash}`);
}

const flag = process.argv[2];  // Pass flag as command line arg
if (!flag) {
  console.error('Please provide a flag to hash');
  process.exit(1);
}

generateHash(flag);
