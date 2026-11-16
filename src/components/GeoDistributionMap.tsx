import React, { useMemo, useState } from 'react';
import { translateCountry } from '../utils/i18n';
import { Language } from '../utils/i18n';

type CountryDatum = { country: string; jobs: number; share: number; avgSalary: number };
type Props = {
  data: CountryDatum[];
  language: Language;
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
};

const GEO: Record<string, { lon: number; lat: number }> = {
  'United States': { lon: -98, lat: 39 },
  'United Kingdom': { lon: -2, lat: 54 },
  Germany: { lon: 10.4, lat: 51 },
  France: { lon: 2.2, lat: 46 },
  Canada: { lon: -106, lat: 56 },
  Australia: { lon: 134, lat: -25 },
  Switzerland: { lon: 8.2, lat: 46.8 },
  Denmark: { lon: 9.5, lat: 56 }
};

const TILE_ZOOM = 2;
const TILE_COUNT = 2 ** TILE_ZOOM;
const TILES = Array.from({ length: TILE_COUNT * TILE_COUNT }, (_, index) => ({
  x: index % TILE_COUNT,
  y: Math.floor(index / TILE_COUNT)
}));

const project = (lon: number, lat: number) => {
  const safeLat = Math.max(-85.0511, Math.min(85.0511, lat));
  const sin = Math.sin((safeLat * Math.PI) / 180);
  return {
    x: ((lon + 180) / 360) * 100,
    y: ((0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI))) * 100
  };
};

export const GeoDistributionMap: React.FC<Props> = ({ data, language, selectedCountry, onSelectCountry }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [failedTiles, setFailedTiles] = useState(0);
  const sorted = useMemo(
    () => [...data].filter(d => GEO[d.country] && d.jobs > 0).sort((a, b) => b.jobs - a.jobs),
    [data]
  );
  const maxJobs = Math.max(1, ...sorted.map(d => d.jobs));
  const number = (v: number) => v.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
  const ar = language === 'ar';

  return (
    <div className="w-full min-w-0">
      <div className="relative w-full overflow-hidden rounded-xl border border-[#5b3a26] bg-[#101820]">
        <div className="relative mx-auto aspect-square w-full max-w-[760px] overflow-hidden bg-[#17232d]" role="group" aria-label={ar ? 'خريطة جغرافية تفاعلية' : 'Interactive geographic map'}>
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
            {TILES.map(tile => (
              <img
                key={tile.x + '-' + tile.y}
                src={`https://basemaps.cartocdn.com/dark_all/${TILE_ZOOM}/${tile.x}/${tile.y}.png`}
                alt=""
                aria-hidden="true"
                draggable={false}
                loading="lazy"
                onError={() => setFailedTiles(v => v + 1)}
                className="h-full w-full min-w-0 object-cover"
              />
            ))}
          </div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg,rgba(7,13,19,.08),rgba(7,13,19,.22))' }} />
          {sorted.map(d => {
            const p = project(GEO[d.country].lon, GEO[d.country].lat);
            const radius = 9 + Math.sqrt(d.jobs / maxJobs) * 15;
            const active = selectedCountry === d.country;
            const isHover = hovered === d.country;
            return (
              <button
                key={d.country}
                type="button"
                aria-label={`${translateCountry(d.country, language)}: ${number(d.jobs)}`}
                title={`${translateCountry(d.country, language)} · ${number(d.jobs)} · ${d.share}%`}
                onMouseEnter={() => setHovered(d.country)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(d.country)}
                onBlur={() => setHovered(null)}
                onClick={() => onSelectCountry(selectedCountry === d.country ? 'All' : d.country)}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-white"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: radius * 2,
                  height: radius * 2,
                  background: active ? 'rgba(255,177,92,.9)' : 'rgba(239,135,62,.72)',
                  borderColor: active || isHover ? '#fff3e6' : '#f6c49a',
                  boxShadow: active || isHover ? '0 0 0 7px rgba(255,177,92,.2),0 0 24px rgba(255,143,67,.8)' : '0 0 15px rgba(239,135,62,.5)',
                  cursor: 'pointer'
                }}
              >
                <span className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-white" />
              </button>
            );
          })}
          {hovered && (() => {
            const d = sorted.find(item => item.country === hovered);
            if (!d) return null;
            const p = project(GEO[d.country].lon, GEO[d.country].lat);
            return (
              <div
                className="absolute z-20 pointer-events-none rounded-lg border border-[#8b6548] bg-[#17100c]/95 px-3 py-2 text-xs text-[#fff0e5] shadow-xl"
                style={{ left: `${Math.min(76, Math.max(2, p.x))}%`, top: `${Math.max(2, p.y - 9)}%` }}
              >
                <div className="font-bold">{translateCountry(d.country, language)}</div>
                <div className="mt-1 text-[#efad78]">{number(d.jobs)} {ar ? 'إعلان وظيفة' : 'postings'} · {d.share}%</div>
              </div>
            );
          })()}
          <div className="absolute bottom-3 start-3 rounded-md border border-white/10 bg-[#101820]/90 px-2.5 py-1.5 text-[10px] text-[#d9e4ed]">
            {ar ? 'خريطة عالمية تفاعلية' : 'Interactive world map'}
          </div>
          <div className="absolute bottom-3 end-3 rounded-md bg-[#101820]/90 px-2 py-1 text-[9px] text-[#aebdca]">
            © OpenStreetMap © CARTO
          </div>
        </div>
        {failedTiles > 0 && failedTiles === TILES.length && (
          <div className="absolute inset-0 grid place-items-center bg-[#101820] p-6 text-center text-sm text-[#d9e4ed]">
            {ar ? 'تعذر تحميل بلاطات الخريطة. تحقق من اتصال الإنترنت.' : 'Map tiles could not load. Please check the internet connection.'}
          </div>
        )}
      </div>
      <div className="mt-2 px-1 text-[10px] text-[#a98d77]">
        {ar ? 'حجم العلامة يتناسب مع عدد إعلانات الوظائف • اختر دولة من الخريطة أو البطاقات لتصفية النتائج' : 'Marker size is proportional to job postings • Select a country on the map or in the cards to filter results'}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {sorted.slice(0, 8).map((d, i) => (
          <button
            key={d.country}
            type="button"
            onClick={() => onSelectCountry(selectedCountry === d.country ? 'All' : d.country)}
            onMouseEnter={() => setHovered(d.country)}
            onMouseLeave={() => setHovered(null)}
            className={`min-w-0 rounded-lg border px-3 py-2 text-left rtl:text-right transition-colors ${selectedCountry === d.country ? 'border-[#ef873e] bg-[#392315]' : 'border-[#4b3324] bg-[#1a120d] hover:border-[#b87545]'}`}
          >
            <div className="flex items-center justify-between gap-2 text-[10px] text-[#cbb29d]">
              <span className="truncate">{translateCountry(d.country, language)}</span>
              <span className="font-bold text-[#ef873e]">#{i + 1}</span>
            </div>
            <div className="mt-1 text-sm font-bold tabular-nums text-[#fff0e5]">{number(d.jobs)}</div>
            <div className="mt-1 text-[10px] text-[#a88d78]">{d.share}% {ar ? 'من الإجمالي' : 'of total'}</div>
          </button>
        ))}
      </div>
      <div className="mt-2 text-[10px] text-[#a88d78]">
        {ar
          ? `تم تحديد مواقع ${sorted.length} دول من ${data.filter(d => d.jobs > 0).length} دول نشطة في البيانات. الدول التي لا تتوفر لها إحداثيات معتمدة تظهر في جدول التوزيع.`
          : `Mapped ${sorted.length} of ${data.filter(d => d.jobs > 0).length} active countries. Countries without a verified map location remain available in the distribution table.`}
      </div>
    </div>
  );
};
