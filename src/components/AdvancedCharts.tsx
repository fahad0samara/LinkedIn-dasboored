import React, { useState } from 'react';

export type NativeDatum = { label: string; value: number; secondary?: number; color?: string; id?: string };
export type NativeChartKind = 'stream' | 'monthly' | 'lollipop' | 'donut' | 'waffle' | 'radial' | 'bubble' | 'bump' | 'stacked';

type Props = {
  kind: NativeChartKind;
  data: NativeDatum[];
  secondaryData?: NativeDatum[];
  height?: number;
  color?: string;
  secondaryColor?: string;
  centerLabel?: string;
  centerValue?: string;
  formatValue?: (value: number) => string;
  onSelect?: (datum: NativeDatum) => void;
  language?: 'ar' | 'en';
};

const palette = ['#F08B3D', '#D46B32', '#D6A15B', '#63A77A', '#B95B35', '#E6A04A', '#9C6A48', '#C28B67'];
const fmt = (v: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(v);
const polar = (cx:number, cy:number, r:number, a:number) => [cx + r*Math.cos(a), cy + r*Math.sin(a)];
const ringPath = (cx:number,cy:number,r1:number,r2:number,a0:number,a1:number) => {
  const p1=polar(cx,cy,r2,a0),p2=polar(cx,cy,r2,a1),p3=polar(cx,cy,r1,a1),p4=polar(cx,cy,r1,a0);
  const large=a1-a0>Math.PI?1:0;
  return `M ${p1[0]} ${p1[1]} A ${r2} ${r2} 0 ${large} 1 ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]} A ${r1} ${r1} 0 ${large} 0 ${p4[0]} ${p4[1]} Z`;
};

export const NativeChart: React.FC<Props> = ({
  kind,data,secondaryData=[],height=250,color='#F08B3D',secondaryColor='#D6A15B',
  centerLabel,centerValue,formatValue=fmt,onSelect,language='en'
}) => {
  const [active,setActive]=useState<number|null>(null);
  const total=data.reduce((s,d)=>s+Math.max(0,d.value),0);
  const max=Math.max(1,...data.map(d=>d.value),...secondaryData.map(d=>d.value));
  const rtl=language==='ar';
  const select=(d:NativeDatum,i:number)=>{setActive(i);onSelect?.(d);};
  const label=(d:NativeDatum,limit=rtl?15:18)=>d.label.length>limit?d.label.slice(0,limit-1)+'…':d.label;
  const common={fill:'none' as const,stroke:'#5b4637',strokeWidth:1};
  const svgStyle:React.CSSProperties={display:'block',width:'100%',height:'100%',minWidth:0,maxWidth:'100%',overflow:'visible'};
  const textStyle:React.CSSProperties={fontFamily:'Segoe UI,Tahoma,Arial,sans-serif',unicodeBidi:'plaintext'};
  if(!data.length) return <div className="native-chart-empty">{rtl?'لا توجد بيانات ضمن عوامل التصفية الحالية':'No data for the current filters'}</div>;

  if(kind==='monthly'){
    const rows=data.map((d,i)=>({d,remote:Math.max(0,Math.min(100,secondaryData[i]?.value??0))}));
    const maxPostings=Math.max(1,...rows.map(r=>r.d.value));
    const plot={left:48,right:674,top:30,bottom:222};
    const slot=(plot.right-plot.left)/Math.max(1,rows.length);
    const barWidth=Math.min(48,slot*.54);
    const yCount=(v:number)=>plot.bottom-(Math.max(0,v)/maxPostings)*(plot.bottom-plot.top);
    const yShare=(v:number)=>plot.bottom-(v/100)*(plot.bottom-plot.top);
    const linePoints=rows.map((r,i)=>({x:plot.left+slot*(i+.5),y:yShare(r.remote),r}));
    const path=linePoints.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(' ');
    return <svg viewBox="0 0 720 280" role="img" aria-label={rtl?'الإعلانات الشهرية ونسبة العمل عن بُعد':'Monthly postings and remote-work share'} style={svgStyle}>
      {[0,.25,.5,.75,1].map((v,i)=>{const y=plot.bottom-v*(plot.bottom-plot.top);return <g key={i}><line x1={plot.left} x2={plot.right} y1={y} y2={y} stroke="#5b4637" strokeWidth="1" opacity=".72"/><text x={rtl?plot.right+12:plot.left-12} y={y+4} textAnchor={rtl?'start':'end'} fill="#bda48f" fontSize="11" style={textStyle}>{Math.round(maxPostings*v).toLocaleString(rtl?'ar-EG':'en-US')}</text><text x={rtl?plot.left-12:plot.right+12} y={y+4} textAnchor={rtl?'end':'start'} fill={secondaryColor} fontSize="11" style={textStyle}>{Math.round(v*100)}%</text></g>})}
      {rows.map((r,i)=>{const x=plot.left+slot*(i+.5),y=yCount(r.d.value),h=plot.bottom-y;return <g key={r.d.id||r.d.label} onMouseEnter={()=>setActive(i)} onMouseLeave={()=>setActive(null)} opacity={active===null||active===i?1:.52}><rect x={x-barWidth/2} y={y} width={barWidth} height={h} rx="5" fill={color} fillOpacity=".82"><title>{r.d.label}: {formatValue(r.d.value)} {rtl?'إعلاناً':'postings'}</title></rect><text x={x} y={Math.max(plot.top-8,y-8)} textAnchor="middle" fill="#f4e3d5" fontSize="11" fontWeight="650" style={textStyle}>{formatValue(r.d.value)}</text><text x={x} y="248" textAnchor="middle" fill="#d4bdab" fontSize="12" style={textStyle}>{label(r.d,12)}</text></g>})}
      {linePoints.length>1&&<path d={path} fill="none" stroke={secondaryColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>}
      {linePoints.map((p,i)=><g key={i} onMouseEnter={()=>setActive(i)} onMouseLeave={()=>setActive(null)}><circle cx={p.x} cy={p.y} r={active===i?7:5} fill={secondaryColor} stroke="#1b120d" strokeWidth="2"><title>{p.r.d.label}: {p.r.remote.toLocaleString(rtl?'ar-EG':'en-US')}% {rtl?'عمل عن بُعد':'remote share'}</title></circle><text x={p.x} y={Math.max(16,p.y-12)} textAnchor="middle" fill="#e8c8ff" fontSize="11" fontWeight="700" style={textStyle}>{p.r.remote.toLocaleString(rtl?'ar-EG':'en-US',{maximumFractionDigits:1})}%</text></g>)}
    </svg>;
  }

  if(kind==='donut'||kind==='radial'){
    const sum=kind==='radial'?Math.max(0,Math.min(100,data[0].value)):total;
    const slices=kind==='radial'?[{...data[0],value:sum},{label:rtl?'المتبقي':'Remaining',value:100-sum,color:'#302a25'}]:data;
    let angle=-Math.PI/2;
    return <svg viewBox="0 0 360 250" role="img" aria-label={rtl?'مخطط دائري':'Donut chart'} style={svgStyle}>
      {slices.map((d,i)=>{const a0=angle;const a1=angle+(Math.max(0,d.value)/(kind==='radial'?100:total||1))*Math.PI*2;angle=a1;return <path key={d.id||d.label} d={ringPath(180,116,kind==='radial'?70:61,kind==='radial'?91:101,a0,a1-0.012)} fill={d.color||palette[i%palette.length]} opacity={active===null||active===i?1:.38} onMouseEnter={()=>setActive(i)} onMouseLeave={()=>setActive(null)} onClick={()=>select(d,i)} style={{cursor:onSelect?'pointer':'default',transition:'opacity .18s'}}><title>{d.label}: {formatValue(d.value)}</title></path>})}
      {centerValue&&<text x="180" y="111" textAnchor="middle" fill="#fff1e6" fontSize="23" fontWeight="700" style={textStyle}>{centerValue}</text>}
      {centerLabel&&<text x="180" y="135" textAnchor="middle" fill="#c7a98f" fontSize="13" style={textStyle}>{centerLabel}</text>}
    </svg>;
  }

  if(kind==='waffle'){
    const cells=100;let cursor=0;
    return <svg viewBox="0 0 560 230" role="img" aria-label={rtl?'مخطط وحدات':'Waffle chart'} style={svgStyle}>
      {data.map((d,i)=>{const n=Math.max(0,Math.round(d.value/(total||1)*cells));const start=cursor;cursor+=n;return Array.from({length:n},(_,j)=>{const k=start+j;return <rect key={`${i}-${j}`} x={10+(k%10)*55} y={10+Math.floor(k/10)*21} width="48" height="16" rx="3" fill={d.color||palette[i%palette.length]} opacity={active===null||active===i?1:.28} onMouseEnter={()=>setActive(i)} onMouseLeave={()=>setActive(null)} onClick={()=>select(d,i)} style={{cursor:onSelect?'pointer':'default'}}><title>{d.label}: {formatValue(d.value)}</title></rect>})})}
    </svg>;
  }

  if(kind==='lollipop'){
    const rows=[...data].sort((a,b)=>b.value-a.value).slice(0,10);
    const rowGap=25;
    const chartHeight=Math.max(230,rows.length*rowGap+22);
    return <svg viewBox={`0 0 560 ${chartHeight}`} role="img" aria-label={rtl?'مقارنة الفئات':'Category comparison'} style={svgStyle}>
      {rows.map((d,i)=>{const y=18+i*rowGap,x0=rtl?300:260,x1=rtl?300-(d.value/max)*245:260+(d.value/max)*245;return <g key={d.id||d.label} onClick={()=>select(d,i)} style={{cursor:onSelect?'pointer':'default'}} onMouseEnter={()=>setActive(i)} onMouseLeave={()=>setActive(null)} opacity={active===null||active===i?1:.48}>
        <text x={rtl?540:10} y={y+5} textAnchor={rtl?'end':'start'} direction={rtl?'rtl':'ltr'} fill="#e4d1c1" fontSize="14" style={textStyle}>{label(d,rtl?27:30)}</text>
        <line x1={x0} y1={y} x2={x1} y2={y} stroke={d.color||color} strokeWidth="3" opacity=".48"/>
        <circle cx={x1} cy={y} r={active===i?8:6} fill={d.color||color}><title>{d.label}: {formatValue(d.value)}</title></circle>
        <text x={rtl?16:544} y={y+5} textAnchor={rtl?'start':'end'} fill="#fff1e6" fontSize="13" fontWeight="700" style={textStyle}>{formatValue(d.value)}</text>
      </g>})}
    </svg>;
  }

  if(kind==='bubble'){
    const sorted=[...data].sort((a,b)=>b.value-a.value).slice(0,8);
    const positions=sorted.map((d,i)=>({d,i,x:70+(i%4)*140,y:72+Math.floor(i/4)*118,r:Math.max(27,Math.min(52,Math.sqrt(d.value/max)*49))}));
    return <svg viewBox="0 0 560 250" role="img" aria-label={rtl?'مقارنة الدول':'Country comparison'} style={svgStyle}>
      {positions.map(({d,i,x,y,r})=><g key={d.id||d.label} onClick={()=>select(d,i)} onMouseEnter={()=>setActive(i)} onMouseLeave={()=>setActive(null)} style={{cursor:onSelect?'pointer':'default'}} opacity={active===null||active===i?1:.35}>
        <circle cx={x} cy={y} r={r} fill={d.color||palette[i%palette.length]} fillOpacity=".84" stroke="#fff" strokeOpacity=".38" strokeWidth="1.5"><title>{d.label}: {formatValue(d.value)}</title></circle>
        <text x={x} y={Math.max(13,y-r-6)} textAnchor="middle" fill="#f4e3d5" fontSize="14" fontWeight="650" style={textStyle}>{label(d,16)}</text>
        <text x={x} y={y+4} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="650" style={textStyle}>{formatValue(d.value)}</text>
      </g>)}
    </svg>;
  }

  if(kind==='bump'){
    const names=data.map(d=>d.label);
    const series=[{data,color},{data:secondaryData,color:secondaryColor}].filter(s=>s.data.length);
    const rows=names.map(name=>({name,values:series.map(s=>s.data.find(d=>d.label===name)?.value??0)}));
    const x=(i:number)=>38+i*(440/Math.max(1,names.length-1));
    const y=(v:number)=>18+(1-v/max)*180;
    return <svg viewBox="0 0 520 225" role="img" style={svgStyle}>
      {[0,.25,.5,.75,1].map(v=><line key={v} x1="30" x2="490" y1={18+v*180} y2={18+v*180} {...common}/>)}
      {rows.map((r,i)=><g key={r.name}><polyline points={r.values.map((v,j)=>`${x(j)} ${y(v)}`).join(' ')} fill="none" stroke={palette[i%palette.length]} strokeWidth="2.5"/>{r.values.map((v,j)=><circle key={j} cx={x(j)} cy={y(v)} r="5" fill={palette[i%palette.length]}><title>{r.name}: {formatValue(v)}</title></circle>)}</g>)}
      {names.map((n,i)=><text key={n} x={x(i)} y="215" textAnchor="middle" fill="#d4bdab" fontSize="12" style={textStyle}>{label({label:n,value:0})}</text>)}
    </svg>;
  }

  if(kind==='stacked'){
    const rows=data.slice(0,8),barW=340/Math.max(1,rows.length);
    return <svg viewBox="0 0 390 250" role="img" style={svgStyle}>
      {rows.map((d,i)=>{const a=Math.max(0,d.value),b=Math.max(0,d.secondary??0),h1=a/max*170,h2=b/max*170,x=25+i*barW;return <g key={d.id||d.label} onClick={()=>select(d,i)} style={{cursor:onSelect?'pointer':'default'}}><rect x={x+5} y={210-h1} width={barW-12} height={h1} rx="3" fill={color}><title>{d.label}: {formatValue(a)}</title></rect><rect x={x+5} y={210-h1-h2} width={barW-12} height={h2} rx="3" fill={secondaryColor}><title>{d.label}: {formatValue(b)}</title></rect><text x={x+barW/2} y="230" textAnchor="middle" fill="#d4bdab" fontSize="12" style={textStyle}>{label(d,12)}</text></g>})}
    </svg>;
  }

  const points=data.map((d,i)=>({x:30+i*(460/Math.max(1,data.length-1)),y:190-(d.value/max)*150}));
  const line=points.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(' ');
  const area=points.length? `${line} L ${points[points.length-1].x} 195 L ${points[0].x} 195 Z`:'';
  const second=secondaryData.map((d,i)=>({x:30+i*(460/Math.max(1,secondaryData.length-1)),y:190-(d.value/max)*150}));
  const secondLine=second.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(' ');
  return <svg viewBox="0 0 520 235" role="img" aria-label={rtl?'الاتجاه الزمني':'Trend chart'} style={svgStyle}>
    {[40,90,140,190].map(y=><line key={y} x1="28" x2="500" y1={y} y2={y} {...common}/>)}
    {points.length>1&&<path d={area} fill={color} fillOpacity=".14"/>}
    {points.length>1&&<path d={line} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>}
    {second.length>1&&<path d={secondLine} fill="none" stroke={secondaryColor} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>}
    {points.map((p,i)=><g key={i} onMouseEnter={()=>setActive(i)} onMouseLeave={()=>setActive(null)}><circle cx={p.x} cy={p.y} r={active===i?6:3.5} fill={color}><title>{data[i].label}: {formatValue(data[i].value)}</title></circle><text x={p.x} y="218" textAnchor="middle" fill="#d4bdab" fontSize="12" style={textStyle}>{label(data[i],12)}</text></g>)}
  </svg>;
};
