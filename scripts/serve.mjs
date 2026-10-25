// Minimal static server that mimics GitHub Pages (serves dist/ under /tharau-portfolio/).
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { gzipSync } from 'node:zlib';

const BASE = '/tharau-portfolio';
const DIST = new URL('../dist', import.meta.url).pathname;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.json': 'application/json', '.pdf': 'application/pdf',
  '.webmanifest': 'application/manifest+json',
};

export function serve(port = 4321) {
  const server = http.createServer(async (req, res) => {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (!path.startsWith(BASE)) { res.writeHead(404); return res.end('not found'); }
    path = normalize(path.slice(BASE.length) || '/');
    let file = join(DIST, path);
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      let body = await readFile(file);
      const type = TYPES[extname(file)] ?? 'application/octet-stream';
      const headers = { 'Content-Type': type, 'Cache-Control': 'max-age=600' };
      // GitHub Pages gzips text responses; do the same so local audits are realistic.
      if (/text|javascript|json|xml|svg|manifest/.test(type) && /gzip/.test(req.headers['accept-encoding'] ?? '')) {
        body = gzipSync(body);
        headers['Content-Encoding'] = 'gzip';
      }
      res.writeHead(200, headers);
      res.end(body);
    } catch {
      res.writeHead(404); res.end('not found');
    }
  });
  return new Promise((r) => server.listen(port, () => r(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await serve(Number(process.env.PORT) || 4321);
  console.log('serving http://localhost:4321/tharau-portfolio/');
}
