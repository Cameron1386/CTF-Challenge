const bcrypt = require('bcrypt');
const flag = 'CTF{...}';
const rounds = 12;

bcrypt.hash(flag, rounds).then(hash => {
  console.log("FLAG_HASH=" + hash);
});
