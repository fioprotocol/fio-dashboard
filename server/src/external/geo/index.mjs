import COUNTRY_LOCATION_MAP_JSON from './country-location.json';
import TZ_LOCATION_MAP_JSON from './zones.json';

let COUNTRY_LOCATION_MAP = null;
let TZ_LOCATION_MAP = null;

export const getLocByCountry = ({ tz, code }) => {
  if (TZ_LOCATION_MAP === null) {
    TZ_LOCATION_MAP = { ...TZ_LOCATION_MAP_JSON };
  }
  if (COUNTRY_LOCATION_MAP === null) {
    COUNTRY_LOCATION_MAP = { ...COUNTRY_LOCATION_MAP_JSON };
  }

  if (tz) return TZ_LOCATION_MAP[tz] || TZ_LOCATION_MAP['America/Detroit'];

  if (code) return COUNTRY_LOCATION_MAP[code] || COUNTRY_LOCATION_MAP['US'];
};
