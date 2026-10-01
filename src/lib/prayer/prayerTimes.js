// Islamic prayer-time engine.
//
// Architecture:
//  - getPrayerTimes() computes the five daily prayers + sunrise/sunset/midnight
//    from a location, date, timezone, calculation method and Asr madhhab using
//    the standard astronomical algorithm (declination + equation of time). This
//    is "calculated" data (source: "calc").
//  - When no location is available, callers fall back to MOCK_TIMES (source:
//    "mock") so the UI is never empty.
//  - A future real prayer-times API (e.g. Aladhan) plugs in via
//    fetchPrayerTimesFromAPI() — keep the same return shape and the rest of the
//    app does not change. That call would run from a backend function with the
//    user's location/method.
//  - buildSchedule() turns a times map into the current/next prayer, per-prayer
//    status and a human countdown, used by the dashboard.

import { getMethod, getMadhhabFactor } from "./calcMethods";

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const dsin = (d) => Math.sin(d * D2R);
const dcos = (d) => Math.cos(d * D2R);
const dtan = (d) => Math.tan(d * D2R);
const darcsin = (x) => Math.asin(x) * R2D;
const darccos = (x) => Math.acos(x) * R2D;
const darccot = (x) => R2D * Math.atan2(1, x);
const fixAngle = (a) => ((a % 360) + 360) % 360;
const fixHour = (h) => ((h % 24) + 24) % 24;

// Shown when no coordinates are set — a representative Central-European day.
export const MOCK_TIMES = {
  fajr: "05:12",
  sunrise: "06:38",
  dhuhr: "13:18",
  asr: "16:42",
  maghrib: "19:34",
  isha: "21:18",
  midnight: "01:26",
};

function julianDate(year, month, day) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function sunPosition(jd) {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * dsin(g) + 0.02 * dsin(2 * g));
  const e = 23.439 - 0.00000036 * D;
  const RA = (Math.atan2(dcos(e) * dsin(L), dcos(L)) * R2D) / 15;
  const equation = q / 15 - fixHour(RA);
  const declination = darcsin(dsin(e) * dsin(L));
  return { declination, equation };
}

export function getPrayerTimes({ date, latitude, longitude, calcMethod = "MWL", asrMadhhab = "shafi", tzOffsetHours = 0 }) {
  const method = getMethod(calcMethod);
  const factor = getMadhhabFactor(asrMadhhab);
  const d = date || new Date();
  const y = d.getFullYear();
  const mo = d.getMonth() + 1;
  const day = d.getDate();
  const lng = longitude || 0;
  const lat = latitude || 0;
  const jDate = julianDate(y, mo, day) - lng / (15 * 24);

  const decl = (t) => sunPosition(jDate + t).declination;
  const eqt = (t) => sunPosition(jDate + t).equation;
  const midDay = (t) => fixHour(12 - eqt(t));
  const sunAngleTime = (t, angle, ccw) => {
    const noon = midDay(t);
    const dec = decl(t);
    let arg = (-dsin(angle) - dsin(dec) * dsin(lat)) / (dcos(dec) * dcos(lat));
    if (!isFinite(arg)) return noon;
    arg = Math.max(-1, Math.min(1, arg));
    const tt = (1 / 15) * darccos(arg);
    return noon + (ccw ? -tt : tt);
  };
  const asrAngleTime = (t, ccw) => {
    const dec = decl(t);
    const angle = -darccot(factor + dtan(Math.abs(lat - dec)));
    return sunAngleTime(t, angle, ccw);
  };

  // First pass at t = 0 (noon base), then refine using the first estimate.
  let fajr = sunAngleTime(0, method.fajr, true);
  let sunrise = sunAngleTime(0, 0.833, true);
  let dhuhr = midDay(0);
  let asr = asrAngleTime(0, false);
  let sunset = sunAngleTime(0, 0.833, false);
  let maghrib = method.maghrib != null ? sunAngleTime(0, method.maghrib, false) : sunset;
  let isha =
    method.ishaMinutes != null
      ? maghrib + method.ishaMinutes / 60
      : sunAngleTime(0, method.isha, false);

  fajr = sunAngleTime(fajr / 24, method.fajr, true);
  sunrise = sunAngleTime(sunrise / 24, 0.833, true);
  dhuhr = midDay(dhuhr / 24);
  asr = asrAngleTime(asr / 24, false);
  sunset = sunAngleTime(sunset / 24, 0.833, false);
  maghrib = method.maghrib != null ? sunAngleTime(maghrib / 24, method.maghrib, false) : sunset;
  isha =
    method.ishaMinutes != null
      ? maghrib + method.ishaMinutes / 60
      : sunAngleTime(isha / 24, method.isha, false);

  // Convert local apparent solar time → clock time.
  const tzAdj = (tzOffsetHours || 0) - lng / 15;
  const adjust = (h) => fixHour(h + tzAdj);

  // Islamic midnight ≈ midpoint between maghrib and the following Fajr.
  const midnight = fixHour((adjust(maghrib) + 24 + adjust(fajr)) / 2);

  return {
    fajr: formatHHMM(adjust(fajr)),
    sunrise: formatHHMM(adjust(sunrise)),
    dhuhr: formatHHMM(adjust(dhuhr)),
    asr: formatHHMM(adjust(asr)),
    maghrib: formatHHMM(adjust(maghrib)),
    isha: formatHHMM(adjust(isha)),
    midnight: formatHHMM(midnight),
    source: "calc",
  };
}

// Reserved for a future live prayer-times API. Kept here so the call site is
// documented; it must return the same shape as getPrayerTimes() with
// source: "api". Implement it in a backend function that holds the API key and
// forwards only the bounded inputs (lat/lng/date/method/madhhab).
export async function fetchPrayerTimesFromAPI(/* params */) {
  throw new Error("Live prayer-times API not connected yet.");
}

function formatHHMM(h) {
  if (h == null || isNaN(h)) return "--:--";
  const totalMin = Math.round((((h % 24) + 24) % 24) * 60);
  const hh = Math.floor(totalMin / 60) % 24;
  const mm = totalMin % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function parseHHMM(hhmm, base) {
  if (!hhmm || hhmm === "--:--") return null;
  const [h, m] = hhmm.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  const dt = new Date(base.getFullYear(), base.getMonth(), base.getDate(), h, m, 0, 0);
  return dt;
}

// Derive timezone offset (hours) for a date + IANA tz, falling back to the
// browser offset. DST is handled automatically because we read it for the
// specific date.
export function tzOffsetFor(date, tz) {
  if (tz) {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        timeZoneName: "longOffset",
      }).formatToParts(date);
      const off = parts.find((p) => p.type === "timeZoneName")?.value || "";
      const m = off.match(/GMT([+-])(\d{1,2}):?(\d{2})/);
      if (m) {
        return (m[1] === "-" ? -1 : 1) * (parseInt(m[2], 10) + parseInt(m[3], 10) / 60);
      }
    } catch (e) {
      /* fall through */
    }
  }
  return -date.getTimezoneOffset() / 60;
}

export function buildSchedule(times, now) {
  const order = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
  const dates = {};
  order.forEach((k) => {
    dates[k] = parseHHMM(times[k], now);
  });

  let currentKey = null;
  order.forEach((k) => {
    if (dates[k] && dates[k] <= now) currentKey = k;
  });

  let nextKey = order.find((k) => dates[k] && dates[k] > now);
  let nextDate = nextKey ? dates[nextKey] : null;
  if (!nextKey) {
    nextKey = "fajr";
    nextDate = parseHHMM(times.fajr, new Date(now.getTime() + 86400000));
  }

  const statuses = {};
  order.forEach((k) => {
    if (!dates[k]) {
      statuses[k] = "upcoming";
    } else if (k === currentKey) {
      statuses[k] = "now";
    } else if (dates[k] > now) {
      statuses[k] = "upcoming";
    } else {
      statuses[k] = "missed";
    }
  });

  const diffMs = Math.max(0, nextDate - now);
  const totalMin = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;

  return {
    nextKey,
    nextDate,
    nextTime: times[nextKey],
    countdown: { hours, minutes, totalMin },
    statuses,
    currentKey,
  };
}