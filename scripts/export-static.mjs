import { spawn } from 'node:child_process';
import { copyFile, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const nextCli = fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url));
const staticBasePath = process.env.STATIC_BASE_PATH ?? '';
const build = spawn(process.execPath, [nextCli, 'build'], {
  env: { ...process.env, STATIC_EXPORT: 'true', STATIC_BASE_PATH: staticBasePath },
  stdio: 'inherit',
});

build.on('error', () => process.exit(1));
build.on('exit', async code => {
  if (code !== 0) {
    process.exit(code ?? 1);
  }
  const root = path.resolve('out');
  const files = [];
  async function collect(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) await collect(fullPath);
      else if (/\.(html|css|js|txt)$/i.test(entry.name)) files.push(fullPath);
    }
  }
  await collect(root);
  for (const file of files) {
    let content = await readFile(file, 'utf8');
    if (staticBasePath) {
    const escapedBasePath = staticBasePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rootLink = new RegExp(`(href|src)=(\"|')/(?!${escapedBasePath.slice(1)}/)`, 'g');
    content = content.replace(rootLink, `$1=$2${staticBasePath}/`);
    const rootCssAsset = new RegExp(`url\\((\"|')?/(?!${escapedBasePath.slice(1)}/)`, 'g');
    content = content.replace(rootCssAsset, `url($1${staticBasePath}/`);
    for (const assetPrefix of ['/images/', '/fonts/', '/pdfs/']) {
      content = content.split(`\"${assetPrefix}`).join(`\"${staticBasePath}${assetPrefix}`);
      content = content.split(`'${assetPrefix}`).join(`'${staticBasePath}${assetPrefix}`);
      content = content.split(`\`${assetPrefix}`).join(`\`${staticBasePath}${assetPrefix}`);
    }
    if (file.endsWith('.html')) {
      content = content.replaceAll(`href=\"${staticBasePath}//`, `href=\"${staticBasePath}/`);
      content = content.replaceAll(`src=\"${staticBasePath}//`, `src=\"${staticBasePath}/`);
    }
    }
    await writeFile(file, content);
  }
  for (const file of files) {
    if (!file.endsWith(`${path.sep}__PAGE__.txt`)) continue;
    const payloadDirectory = path.dirname(file);
    const payloadName = path.basename(payloadDirectory);
    if (!payloadName.startsWith('__next.')) continue;
    const routeDirectory = path.dirname(payloadDirectory);
    await copyFile(file, path.join(routeDirectory, `${payloadName}.__PAGE__.txt`));
  }
  process.exit(0);
});
