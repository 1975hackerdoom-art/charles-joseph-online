import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceRoots = ['app', 'components', 'content'];
const sourceExtensions = /\.(css|json|md|ts|tsx)$/i;
const imageReference = /\/images\/[^\"'`\s)<>]+/g;
const rasterImage = /\.(png|jpe?g)$/i;
const references = new Set();
const sourceFiles = [];

async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await collect(file);
    else if (sourceExtensions.test(entry.name)) sourceFiles.push(file);
  }
}

for (const root of sourceRoots) await collect(root);
for (const file of sourceFiles) {
  const content = await readFile(file, 'utf8');
  for (const match of content.matchAll(imageReference)) references.add(match[0]);
}

let converted = 0;
let beforeBytes = 0;
let afterBytes = 0;
const replacements = new Map();

for (const reference of references) {
  if (!rasterImage.test(reference)) continue;
  const source = path.join('public', reference.slice(1));
  try {
    const sourceStats = await stat(source);
    const target = source.replace(rasterImage, '.webp');
    await sharp(source).webp({ quality: 82, effort: 5 }).toFile(target);
    const targetStats = await stat(target);
    if (targetStats.size < sourceStats.size) {
      replacements.set(reference, reference.replace(rasterImage, '.webp'));
      converted += 1;
      beforeBytes += sourceStats.size;
      afterBytes += targetStats.size;
    }
  } catch {
    continue;
  }
}

for (const file of sourceFiles) {
  let content = await readFile(file, 'utf8');
  for (const [source, target] of replacements) content = content.split(source).join(target);
  await writeFile(file, content);
}

console.log(JSON.stringify({ converted, beforeBytes, afterBytes, savedBytes: beforeBytes - afterBytes }, null, 2));
