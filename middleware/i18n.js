// middleware/i18n.js
// Middleware de internacionalización para Arte Bonsái
// Idiomas soportados (orden alfabético): Alemán, Español, Francés, Inglés, Italiano

const path = require('path');
const fs = require('fs');
const https = require('https');

// Cargar todos los archivos de traducción en memoria al iniciar
const localesDir = path.join(__dirname, '../locales');
const translations = {};

['de', 'en', 'es', 'fr', 'it'].forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  try {
    translations[lang] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error(`[i18n] Error cargando ${lang}.json:`, e.message);
  }
});

const SUPPORTED_LANGS = ['de', 'en', 'es', 'fr', 'it'];
const DEFAULT_LANG = 'es';

// Mapeo de código de país → idioma por defecto
const COUNTRY_TO_LANG = {
  DE: 'de', AT: 'de', CH: 'de',
  GB: 'en', US: 'en', CA: 'en', AU: 'en', NZ: 'en',
  ES: 'es', MX: 'es', CO: 'es', AR: 'es', PE: 'es',
  CL: 'es', EC: 'es', VE: 'es', PA: 'es',
  FR: 'fr', BE: 'fr', LU: 'fr',
  IT: 'it',
};

/**
 * Obtiene la IP real del usuario (considera proxies)
 */
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress || '';
}

/**
 * Consulta ipapi.co para obtener el país por IP
 * Devuelve una Promise con { countryCode, countryIso } o null
 */
function getCountryByIp(ip) {
  return new Promise((resolve) => {
    // En localhost o IPs privadas no hay datos reales
    if (!ip || ip === '::1' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return resolve(null);
    }
    const url = `https://ipapi.co/${ip}/json/`;
    https.get(url, { headers: { 'User-Agent': 'node.js' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.country_code) {
            resolve({
              countryCode: json.country_code,
              countryIso: json.country_code.toLowerCase()
            });
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

/**
 * Detecta el idioma preferido:
 * 1. Query param  ?lang=en
 * 2. Cookie       lang=en
 * 3. País detectado por IP → idioma asociado
 * 4. Accept-Language header
 * 5. Default: es
 */
async function detectLang(req, countryCode) {
  if (req.query.lang && SUPPORTED_LANGS.includes(req.query.lang)) {
    return req.query.lang;
  }
  if (req.cookies && req.cookies.lang && SUPPORTED_LANGS.includes(req.cookies.lang)) {
    return req.cookies.lang;
  }
  if (countryCode && COUNTRY_TO_LANG[countryCode]) {
    return COUNTRY_TO_LANG[countryCode];
  }
  const acceptLang = req.headers['accept-language'] || '';
  const preferred = acceptLang
    .split(',')
    .map(l => l.split(';')[0].trim().substring(0, 2).toLowerCase())
    .find(l => SUPPORTED_LANGS.includes(l));
  if (preferred) return preferred;
  return DEFAULT_LANG;
}

/**
 * Middleware principal
 */
async function i18nMiddleware(req, res, next) {
  // 1. Detectar país por IP
  const ip = getClientIp(req);
  const countryData = await getCountryByIp(ip);

  // 2. Detectar idioma (ahora también considera el país)
  const lang = await detectLang(req, countryData ? countryData.countryCode : null);

  // Si viene por query param, guardar en cookie (30 días)
  if (req.query.lang && SUPPORTED_LANGS.includes(req.query.lang)) {
    res.cookie('lang', lang, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: false });
  }

  const t = translations[lang] || translations[DEFAULT_LANG];

  req.lang = lang;
  req.t = t;

  // Disponible en todas las vistas EJS
  res.locals.t = t;
  res.locals.lang = lang;
  res.locals.detectedCountry = countryData; // { countryCode: 'CO', countryIso: 'co' } o null
  res.locals.supportedLangs = [
    { code: 'de', label: 'Deutsch',  country: 'de' },
    { code: 'en', label: 'English',  country: 'gb' },
    { code: 'es', label: 'Español',  country: 'es' },
    { code: 'fr', label: 'Français', country: 'fr' },
    { code: 'it', label: 'Italiano', country: 'it' }
  ];

  // Países con campo iso para flag-icons
  res.locals.countries = (t.countries || []).map(c => ({
    ...c,
    iso: c.code.toLowerCase()
  }));

  next();
}

module.exports = i18nMiddleware;
