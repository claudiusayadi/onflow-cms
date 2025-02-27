const secretKey = process.env.SESSION_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);
