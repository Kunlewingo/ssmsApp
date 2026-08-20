const crypto = require('crypto');

// Characters chosen to avoid visually ambiguous ones (0/O, 1/l/I) since this
// password gets read off a screen and typed in by a student.
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

/**
 * Generates a random, readable temporary password for a newly added student.
 * Not meant to be memorable — the student is required to change it on first login.
 */
function generateTempPassword(length = 10) {
  let password = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += CHARS[bytes[i] % CHARS.length];
  }
  return password;
}

module.exports = generateTempPassword;
