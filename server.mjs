import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.PORT) || 3000;
const origin = "https://abaiairport.kz";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "dist");

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");

  if (url.pathname.startsWith("/api/")) {
    try {
      const upstream = await fetch(origin + url.pathname + url.search, {
        headers: { accept: "application/json" },
      });
      const body = Buffer.from(await upstream.arrayBuffer());
      res.writeHead(upstream.status, {
        "content-type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end(body);
    } catch {
      res.writeHead(502, { "content-type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: false }));
    }
    return;
  }

  const relative = path
    .normalize(decodeURIComponent(url.pathname))
    .replace(/^[/\\]+/, "");
  const filePath = path.join(root, relative);
  const insideRoot = filePath === root || filePath.startsWith(root + path.sep);
  const indexFile = path.join(filePath, "index.html");
  let target = path.join(root, "index.html");

  if (insideRoot && fs.existsSync(filePath)) {
    if (fs.statSync(filePath).isFile()) target = filePath;
    else if (fs.existsSync(indexFile)) target = indexFile;
  }

  res.writeHead(200, {
    "content-type": types[path.extname(target)] || "application/octet-stream",
  });
  fs.createReadStream(target).pipe(res);
});

server.listen(port, "0.0.0.0");
