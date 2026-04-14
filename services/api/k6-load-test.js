/**
 * k6 load-test for RINOMED 2026 API
 *
 * Install k6: brew install k6
 * Run:        k6 run services/api/k6-load-test.js
 *
 * This simulates 150 virtual users performing a realistic mix
 * of actions that mirror actual attendee usage during the event.
 */

import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// ── Custom metrics ──────────────────────────────────────────────────────────
const loginDuration = new Trend('login_duration', true);
const sessionsDuration = new Trend('sessions_list_duration', true);
const errorRate = new Rate('errors');

// ── Configuration ───────────────────────────────────────────────────────────
const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';

export const options = {
  // Ramp-up to 150 VUs over 2 min, hold for 5 min, ramp-down over 1 min
  stages: [
    { duration: '30s', target: 50 },   // warm-up
    { duration: '30s', target: 100 },   // ramp
    { duration: '30s', target: 150 },   // peak
    { duration: '5m', target: 150 },    // sustained peak
    { duration: '1m', target: 0 },      // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],   // 95% of requests under 2 s
    errors: ['rate<0.05'],                // error rate under 5%
    login_duration: ['p(95)<3000'],
    sessions_list_duration: ['p(95)<1500'],
  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
const headers = { 'Content-Type': 'application/json' };

function authHeaders(token) {
  return { ...headers, Authorization: `Bearer ${token}` };
}

// Use the demo attendee credentials from seed
const EMAIL = 'attendee@rinomed2026.com';
const PASSWORD = 'Rinomed2026!';

// ── Main scenario ───────────────────────────────────────────────────────────
export default function () {
  let accessToken = '';
  let refreshToken = '';

  // 1. LOGIN
  group('Login', () => {
    const res = http.post(
      `${BASE_URL}/v1/auth/login`,
      JSON.stringify({ email: EMAIL, password: PASSWORD }),
      { headers, tags: { name: 'login' } }
    );
    loginDuration.add(res.timings.duration);
    const ok = check(res, { 'login 200': (r) => r.status === 200 });
    if (!ok) errorRate.add(1);
    else {
      const body = res.json();
      accessToken = body.accessToken;
      refreshToken = body.refreshToken;
      errorRate.add(0);
    }
  });

  if (!accessToken) {
    sleep(1);
    return; // bail if login failed
  }

  // 2. POST-LOGIN "BOOT SEQUENCE" – what the app fires immediately
  group('Boot sequence', () => {
    const responses = http.batch([
      ['GET', `${BASE_URL}/v1/me`, null, { headers: authHeaders(accessToken), tags: { name: 'me' } }],
      ['GET', `${BASE_URL}/v1/event-info`, null, { headers, tags: { name: 'event-info' } }],
      ['GET', `${BASE_URL}/v1/sessions?limit=100`, null, { headers: authHeaders(accessToken), tags: { name: 'sessions-list' } }],
      ['GET', `${BASE_URL}/v1/speakers`, null, { headers, tags: { name: 'speakers' } }],
      ['GET', `${BASE_URL}/v1/sponsors`, null, { headers, tags: { name: 'sponsors' } }],
      ['GET', `${BASE_URL}/v1/statistics`, null, { headers: authHeaders(accessToken), tags: { name: 'statistics' } }],
    ]);

    responses.forEach((r) => {
      const ok = check(r, { 'boot 200': (r) => r.status === 200 });
      if (!ok) errorRate.add(1);
      else errorRate.add(0);
    });

    if (responses[2]) sessionsDuration.add(responses[2].timings.duration);
  });

  sleep(Math.random() * 2 + 1); // think time 1–3 s

  // 3. BROWSING – simulate navigating between screens
  group('Browsing', () => {
    // Sessions by day
    const sessionsDay1 = http.get(
      `${BASE_URL}/v1/sessions?day=2026-04-17`,
      { headers: authHeaders(accessToken), tags: { name: 'sessions-day1' } }
    );
    check(sessionsDay1, { 'sessions day1 200': (r) => r.status === 200 });

    sleep(0.5);

    // Hotels & tourism (public)
    const batch2 = http.batch([
      ['GET', `${BASE_URL}/v1/hotels`, null, { headers, tags: { name: 'hotels' } }],
      ['GET', `${BASE_URL}/v1/tourism`, null, { headers, tags: { name: 'tourism' } }],
      ['GET', `${BASE_URL}/v1/community/gallery`, null, { headers, tags: { name: 'gallery' } }],
    ]);
    batch2.forEach((r) => check(r, { 'browse 200': (r) => r.status === 200 }));
  });

  sleep(Math.random() * 2 + 1);

  // 4. FAVORITES
  group('Favorites', () => {
    const favs = http.get(`${BASE_URL}/v1/favorites`, {
      headers: authHeaders(accessToken),
      tags: { name: 'favorites-list' },
    });
    check(favs, { 'favs 200': (r) => r.status === 200 });
  });

  sleep(Math.random() + 0.5);

  // 5. CERTIFICATE metadata
  group('Certificate', () => {
    const cert = http.get(`${BASE_URL}/v1/certificate`, {
      headers: authHeaders(accessToken),
      tags: { name: 'certificate-meta' },
    });
    check(cert, { 'cert 200': (r) => r.status === 200 });
  });

  sleep(Math.random() + 0.5);

  // 6. REFRESH TOKEN
  group('Token refresh', () => {
    if (!refreshToken) return;
    const res = http.post(
      `${BASE_URL}/v1/auth/refresh`,
      JSON.stringify({ refreshToken }),
      { headers, tags: { name: 'refresh' } }
    );
    check(res, { 'refresh 200': (r) => r.status === 200 });
    if (res.status === 200) {
      const body = res.json();
      accessToken = body.accessToken;
      refreshToken = body.refreshToken;
    }
  });

  // 7. SURVEY (read)
  group('Survey', () => {
    const survey = http.get(`${BASE_URL}/v1/survey`, {
      headers: authHeaders(accessToken),
      tags: { name: 'survey-get' },
    });
    check(survey, { 'survey 200': (r) => r.status === 200 });
  });

  sleep(Math.random() * 3 + 2); // longer think time before loop
}
