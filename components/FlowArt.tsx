import { useId } from 'react';

export default function FlowArt() {
  const id = useId().replace(/:/g, '');
  return <svg className="flow-art" viewBox="0 0 650 670" fill="none" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`${id}-gold`} x1="90" y1="670" x2="550" y2="0" gradientUnits="userSpaceOnUse"><stop stopColor="#bc955c" stopOpacity="0"/><stop offset=".3" stopColor="#bc955c"/><stop offset=".58" stopColor="#ffffff"/><stop offset=".8" stopColor="#bc955c"/><stop offset="1" stopColor="#bc955c" stopOpacity=".15"/></linearGradient>
      <radialGradient id={`${id}-glow`}><stop stopColor="#ffffff" stopOpacity=".9"/><stop offset=".15" stopColor="#bc955c" stopOpacity=".5"/><stop offset="1" stopColor="#bc955c" stopOpacity="0"/></radialGradient>
    </defs>
    <path d="M150 700C620 390 230 310 610-50L710-30C340 340 640 450 330 720Z" fill={`url(#${id}-gold)`} opacity=".055"/>
    {Array.from({length: 38}, (_, i) => <path key={i} d={`M ${-70+i*10} 710 C ${150+i*6} ${450-i*2}, ${530-i*2} ${580-i*6}, ${435-i} ${345-i*3} S ${330+i*4} ${95-i*2}, ${580+i*5} -50`} stroke={`url(#${id}-gold)`} strokeWidth={i%8===0?2: .8} opacity={.25+(i%5)*.13}/>)}
    {[[413,307],[438,227],[321,445],[487,91],[246,504],[367,385]].map(([x,y],i)=><g key={x}><circle cx={x} cy={y} r={i===0?65:30} fill={`url(#${id}-glow)`}/><circle cx={x} cy={y} r={i===0?3:2} fill="#bc955c"/></g>)}
  </svg>;
}
