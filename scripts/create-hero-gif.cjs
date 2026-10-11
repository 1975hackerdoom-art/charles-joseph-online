const sharp = require('sharp');
const fs = require('node:fs');

(async () => {
  const size = 640;
  const count = 40;
  const base = await sharp('public/images/ai-municipal-hero-source.png').resize(size,size).png().toBuffer();
  await sharp(base).webp({quality:86}).toFile('public/images/ai-municipal-hero-still.webp');
  const nodes = [[.436,.094],[.497,.079],[.539,.091],[.407,.113],[.464,.104],[.515,.132],[.565,.112],[.367,.184],[.447,.147],[.546,.16],[.602,.18],[.557,.219],[.484,.237],[.407,.206]];
  const frames = [];
  for (let frame=0; frame<count; frame++) {
    const phase = frame/count*Math.PI*2;
    const glows = nodes.map(([x,y],i) => {
      const pulse = (Math.sin(phase-i*.55)+1)/2;
      return `<circle cx="${x*size}" cy="${y*size}" r="${5+pulse*8}" fill="url(#glow)" opacity="${.15+pulse*.7}"/><circle cx="${x*size}" cy="${y*size}" r="${1+pulse}" fill="#fff4cd" opacity="${.25+pulse*.65}"/>`;
    }).join('');
    const overlay = Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="glow"><stop stop-color="#ffe2a2" stop-opacity=".9"/><stop offset="1" stop-color="#edb86e" stop-opacity="0"/></radialGradient></defs>${glows}</svg>`);
    frames.push(await sharp(base).composite([{input:overlay}]).removeAlpha().raw().toBuffer());
  }
  await sharp(Buffer.concat(frames),{raw:{width:size,height:size*count,channels:3,pageHeight:size}}).gif({loop:0,delay:100,colours:128,dither:0,effort:7}).toFile('public/images/ai-municipal-hero.gif');
  const meta = await sharp('public/images/ai-municipal-hero.gif',{animated:true}).metadata();
  console.log(JSON.stringify({frames:meta.pages,width:meta.width,height:meta.pageHeight,bytes:fs.statSync('public/images/ai-municipal-hero.gif').size}));
})().catch(error=>{console.error(error);process.exit(1)});
