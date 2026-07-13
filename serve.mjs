#!/usr/bin/env node
// Dev server with clean URLs: /platform resolves to platform.html,
// matching how nginx/Vercel/Cloudflare Pages serve static sites in production.
//
// Usage: node serve.mjs [port]
import { createServer } from 'node:http';
import { stat, readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = import.meta.dirname;
const port = Number(process.argv[2]) || 8080;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

async function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  let file = join(root, clean);
  if (!file.startsWith(root)) return null;
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    await stat(file);
    return file;
  } catch {
    try {
      await stat(file + '.html');
      return file + '.html';
    } catch {
      return null;
    }
  }
}

createServer(async (req, res) => {
  const file = await resolve(new URL(req.url, 'http://x').pathname);
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('404');
    return;
  }
  res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
  res.end(await readFile(file));
}).listen(port, () => console.log(`http://localhost:${port}/`));
