const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

for (const file of ["index.html", "style.css", "script.js", "robots.txt", "sitemap.xml"]) {
    fs.copyFileSync(path.join(ROOT, file), path.join(DIST, file));
}

fs.cpSync(path.join(ROOT, "images"), path.join(DIST, "images"), { recursive: true });

console.log("Build selesai! Folder siap deploy: dist/");
