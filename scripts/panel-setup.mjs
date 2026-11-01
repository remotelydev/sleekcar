#!/usr/bin/env node
// Generates the env values for the owner panel (/panel): password hash, TOTP secret and
// session secret. Run locally: `node scripts/panel-setup.mjs` and paste the output into
// Netlify > Site configuration > Environment variables. Nothing is sent anywhere.
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const N = 32768;
const r = 8;
const p = 1;

const rl = createInterface({ input: stdin, output: stdout });
const password = await rl.question("Hasło do panelu (min. 12 znaków): ");
rl.close();

if (password.length < 12) {
  console.error("Hasło musi mieć co najmniej 12 znaków.");
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 32, { N, r, p, maxmem: 256 * 1024 * 1024 });

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
let bits = "";
for (const byte of randomBytes(20)) bits += byte.toString(2).padStart(8, "0");
let totpSecret = "";
for (let i = 0; i + 5 <= bits.length; i += 5) totpSecret += alphabet[parseInt(bits.slice(i, i + 5), 2)];

const label = encodeURIComponent("Sleek Car:panel");
const otpauth = `otpauth://totp/${label}?secret=${totpSecret}&issuer=${encodeURIComponent("Sleek Car")}&algorithm=SHA1&digits=6&period=30`;

console.log(`
PANEL_PASSWORD_HASH=scrypt:${N}:${r}:${p}:${salt.toString("base64url")}:${hash.toString("base64url")}
PANEL_TOTP_SECRET=${totpSecret}
PANEL_SESSION_SECRET=${randomBytes(48).toString("base64url")}

Dodaj klucz do aplikacji (Google Authenticator, 1Password, Authy):
- ręcznie: klucz ${totpSecret}, typ "oparty na czasie",
- albo wygeneruj QR z adresu: ${otpauth}
`);
