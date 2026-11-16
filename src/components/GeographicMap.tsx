import React, { useMemo } from 'react';
import { Language } from '../utils/i18n';

type CountryPoint = {
  country: string;
  displayName: string;
  jobs: number;
  share: number;
  avgSalary: number;
};

interface GeographicMapProps {
  countries: CountryPoint[];
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
  language: Language;
}

const GEO_POINTS: Record<string, { lon: number; lat: number; dx: number; dy: number }> = {
  'United States': { lon: -98, lat: 39, dx: -24, dy: -20 },
  'Canada': { lon: -106, lat: 57, dx: -8, dy: -22 },
  'United Kingdom': { lon: -3, lat: 55, dx: -38, dy: -28 },
  'France': { lon: 2, lat: 46, dx: -35, dy: 28 },
  'Germany': { lon: 10, lat: 51, dx: 36, dy: -28 },
  'Switzerland': { lon: 8, lat: 47, dx: 38, dy: 28 },
  'Denmark': { lon: 10, lat: 56, dx: 42, dy: -3 },
  'Australia': { lon: 134, lat: -25, dx: 24, dy: 0 },
};

const project = (lon: number, lat: number) => ({
  x: 34 + ((lon + 180) / 360) * 832,
  y: 24 + ((82 - lat) / 164) * 342,
});

export const GeographicMap: React.FC<GeographicMapProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
  language,
}) => {
  const maxJobs = Math.max(1, ...countries.map((country) => country.jobs));
  const total = countries.reduce((sum, country) => sum + country.jobs, 0);
  const sorted = useMemo(() => [...countries].sort((a, b) => b.jobs - a.jobs), [countries]);
  const format = (value: number) => value.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');

  return (
    <div className="w-full min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-2 text-[10px] text-[#b49a86]">
        <span>{language === 'ar' ? 'حجم الدائرة = عدد إعلانات الوظائف' : 'Bubble size = job posting volume'}</span>
        <span>{format(total)} {language === 'ar' ? 'إعلاناً ضمن النطاق' : 'postings in scope'}</span>
      </div>
      <div className="w-full min-w-0 overflow-hidden rounded-xl border border-[#513522] bg-[#100b08]">
        <svg viewBox="0 0 900 410" role="img" aria-label={language === 'ar' ? 'خريطة مكانية لتوزيع إعلانات الوظائف حسب الدولة' : 'GIS-style spatial map of job postings by country'} className="block h-auto w-full">
          <defs>
            <pattern id="geo-grid-pattern" width="45" height="45" patternUnits="userSpaceOnUse">
              <path d="M 45 0 L 0 0 0 45" fill="none" stroke="#72533d" strokeWidth="0.7" opacity="0.25" />
            </pattern>
            <linearGradient id="geo-land-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#62442f" stopOpacity="0.72" />
              <stop offset="100%" stopColor="#34251b" stopOpacity="0.78" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="900" height="410" fill="url(#geo-grid-pattern)" />
          {[0, 1, 2, 3, 4].map((index) => {
            const y = 45 + index * 78;
            return <path key={index} d={`M 18 ${y} H 882`} stroke="#8b6a4e" strokeDasharray="3 8" opacity="0.18" />;
          })}
          <g fill="url(#geo-land-gradient)" stroke="#a17a57" strokeWidth="1.2" opacity="0.9">
            <path d="M72 83 L105 54 157 45 191 60 220 58 246 84 235 108 211 118 202 148 178 159 162 190 135 187 122 163 96 150 82 122 60 112Z" />
            <path d="M190 195 L220 207 239 238 231 271 214 306 202 344 182 365 168 331 173 294 159 264 166 230Z" />
            <path d="M355 84 L384 66 415 72 438 89 465 87 492 103 522 99 549 114 574 108 600 123 631 120 657 137 681 132 710 149 742 143 769 160 795 170 815 195 790 207 757 199 729 215 699 206 674 221 643 213 622 231 592 222 567 238 540 220 513 218 488 196 465 192 447 169 425 163 408 137 384 130 367 110Z" />
            <path d="M435 195 L462 205 480 232 473 261 457 286 444 318 424 340 405 319 411 285 396 259 405 229Z" />
            <path d="M695 278 L727 263 765 270 797 291 809 318 788 341 752 350 718 338 692 315Z" />
            <path d="M822 80 L841 74 858 88 849 109 829 108Z" />
          </g>
          <g fill="none" stroke="#a17a57" opacity="0.2">
            <path d="M18 205 Q450 185 882 205" />
            <path d="M18 310 Q450 290 882 310" />
          </g>
          {sorted.map((country) => {
            const point = GEO_POINTS[country.country];
            if (!point) return null;
            const position = project(point.lon, point.lat);
            const radius = 6 + Math.sqrt(country.jobs / maxJobs) * 23;
            const selected = selectedCountry === 'All' || selectedCountry === country.country;
            const labelX = position.x + point.dx;
            const labelY = position.y + point.dy;
            return (
              <g
                key={country.country}
                role="button"
                tabIndex={0}
                aria-label={`${country.displayName}: ${format(country.jobs)}`}
                onClick={() => onSelectCountry(selectedCountry === country.country ? 'All' : country.country)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelectCountry(selectedCountry === country.country ? 'All' : country.country);
                  }
                }}
                className="cursor-pointer"
                opacity={selected ? 1 : 0.28}
              >
                <circle cx={position.x} cy={position.y} r={radius + 8} fill="#ef873e" opacity="0.09" />
                <circle cx={position.x} cy={position.y} r={radius} fill="#00b7c3" fillOpacity="0.78" stroke="#d8fff7" strokeWidth="1.6">
                  <title>{`${country.displayName} — ${format(country.jobs)} — ${country.share}%`}</title>
                </circle>
                <path d={`M ${position.x} ${position.y} L ${labelX} ${labelY}`} stroke="#d5b18f" strokeWidth="1" opacity="0.75" />
                <text x={labelX} y={labelY - 3} fill="#fff0e5" fontSize="12" fontWeight="700" textAnchor="middle" style={{ paintOrder: 'stroke', stroke: '#100b08', strokeWidth: 3 }}>
                  {country.displayName}
                </text>
                <text x={labelX} y={labelY + 12} fill="#e9b88e" fontSize="10" textAnchor="middle" style={{ paintOrder: 'stroke', stroke: '#100b08', strokeWidth: 3 }}>
                  {format(country.jobs)}
                </text>
              </g>
            );
          })}
          <text x="22" y="392" fill="#927b69" fontSize="10">{language === 'ar' ? 'إسقاط مكاني مبسّط • مواقع تمثيلية لمراكز الدول' : 'Simplified spatial projection • representative country centroids'}</text>
        </svg>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {sorted.map((country) => (
          <button
            key={country.country}
            type="button"
            onClick={() => onSelectCountry(selectedCountry === country.country ? 'All' : country.country)}
            className={`rounded-lg border px-2.5 py-1.5 text-[10px] transition-colors ${selectedCountry === country.country ? 'border-[#ef873e] bg-[#3a2415] text-[#fff0e5]' : 'border-[#513522] bg-[#1b120c] text-[#c6ad98] hover:border-[#a96538]'}`}
          >
            {country.displayName} <strong className="ms-1">{format(country.jobs)}</strong>
          </button>
        ))}
      </div>
    </div>
  );
};
