export type CurrencyCode = 'USD' | 'SAR' | 'AED' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'CHF' | 'SGD' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  nameAr: string;
  rateAgainstUSD: number; // 1 USD = X Currency
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', nameAr: 'دولار أمريكي', rateAgainstUSD: 1.0, flag: '🇺🇸' },
  SAR: { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', nameAr: 'ريال سعودي', rateAgainstUSD: 3.75, flag: '🇸🇦' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', nameAr: 'درهم إماراتي', rateAgainstUSD: 3.67, flag: '🇦🇪' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', nameAr: 'يورو', rateAgainstUSD: 0.92, flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', nameAr: 'جنيه إسترليني', rateAgainstUSD: 0.78, flag: '🇬🇧' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', nameAr: 'دولار كندي', rateAgainstUSD: 1.36, flag: '🇨🇦' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', nameAr: 'دولار أسترالي', rateAgainstUSD: 1.52, flag: '🇦🇺' },
  CHF: { code: 'CHF', symbol: 'CHF ', name: 'Swiss Franc', nameAr: 'فرنك سويسري', rateAgainstUSD: 0.89, flag: '🇨🇭' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', nameAr: 'دولار سنغافوري', rateAgainstUSD: 1.34, flag: '🇸🇬' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', nameAr: 'ين ياباني', rateAgainstUSD: 154.5, flag: '🇯🇵' },
};

export function convertSalary(usdAmount: number, targetCurrency: CurrencyCode | string = 'USD'): number {
  const config = CURRENCIES[targetCurrency as CurrencyCode] || CURRENCIES.USD;
  return Math.round(usdAmount * config.rateAgainstUSD);
}

export function formatSalary(
  usdAmount: number, 
  targetCurrency: CurrencyCode | string = 'USD', 
  options: { compact?: boolean; showSymbol?: boolean; isArabic?: boolean } = {}
): string {
  const { compact = false, showSymbol = true, isArabic = false } = options;
  const config = CURRENCIES[targetCurrency as CurrencyCode] || CURRENCIES.USD;
  const converted = convertSalary(usdAmount, targetCurrency);

  if (compact) {
    if (converted >= 1000000) {
      const val = (converted / 1000000).toFixed(1).replace(/\.0$/, '');
      const unit = isArabic ? ' مليون' : 'M';
      return showSymbol ? `${config.symbol} ${val}${unit}` : `${val}${unit}`;
    }
    if (converted >= 1000) {
      const val = (converted / 1000).toFixed(0);
      const unit = isArabic ? ' ألف' : 'k';
      return showSymbol ? `${config.symbol} ${val}${unit}` : `${val}${unit}`;
    }
  }

  const locale = isArabic ? 'ar-EG' : 'en-US';
  const formattedNum = converted.toLocaleString(locale);
  return showSymbol ? `${formattedNum} ${config.symbol}` : formattedNum;
}
