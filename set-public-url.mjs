import fs from "node:fs";
import path from "node:path";

const publicUrl = process.argv[2];

if (!publicUrl || !/^https?:\/\//.test(publicUrl)) {
  console.error("Usage: node tools/set-public-url.mjs https://example.com/");
  process.exit(1);
}

const normalizedUrl = publicUrl.endsWith("/") ? publicUrl : `${publicUrl}/`;
const root = process.cwd();
const pages = [
  { file: "index.html", url: normalizedUrl },
  { file: "pages/self-materials.html", url: `${normalizedUrl}pages/self-materials.html` },
  { file: "pages/human-ai-map.html", url: `${normalizedUrl}pages/human-ai-map.html` },
  { file: "pages/ai-questions.html", url: `${normalizedUrl}pages/ai-questions.html` },
  { file: "pages/ai-contract.html", url: `${normalizedUrl}pages/ai-contract.html` },
  { file: "pages/collaboration-pitfalls.html", url: `${normalizedUrl}pages/collaboration-pitfalls.html` },
];

for (const page of pages) {
  const filePath = path.join(root, page.file);
  let html = fs.readFileSync(filePath, "utf8");
  html = html.replace(/\s*<link rel="canonical" href="[^"]+">\n/g, "\n");
  html = html.replace(/\s*<meta property="og:url" content="[^"]+">\n/g, "\n");
  html = html.replace(
    /(<meta name="robots" content="index, follow">\n)/,
    `$1    <link rel="canonical" href="${page.url}">\n    <meta property="og:url" content="${page.url}">\n`,
  );
  fs.writeFileSync(filePath, html);
}

fs.writeFileSync(
  path.join(root, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${normalizedUrl}sitemap.xml\n`,
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>2026-07-04</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);
console.log(`Public URL metadata updated to ${normalizedUrl}`);
