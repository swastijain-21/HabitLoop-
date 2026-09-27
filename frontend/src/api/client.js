/**
 * Single configurable API base URL for the HabitLoop backend.
 * Set VITE_API_BASE_URL in frontend/.env (e.g. http://localhost:8080).
 * Never put database credentials in the frontend.
 */
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

export function getApiBaseUrl() {
  return API_BASE_URL;
}

/**
 * @param {string} path - e.g. "/api/auth/login"
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
export async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (networkError) {
    const err = new Error(
      'Cannot reach the HabitLoop server. Is the backend running on ' + API_BASE_URL + '?'
    );
    err.cause = networkError;
    err.status = 0;
    throw err;
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const message =
      (body && (body.message || body.error)) ||
      (typeof body === 'string' && body) ||
      `Request failed (${response.status})`;
    const err = new Error(message);
    err.status = response.status;
    err.body = body;
    throw err;
  }

  return body;
}

export async function registerUser({ name, email, password }) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser({ email, password }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function upsertDailyWellness(payload) {
  return apiRequest('/api/wellness/daily', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function fetchWellnessRange(userId, startDate, endDate) {
  const qs = new URLSearchParams({ startDate, endDate });
  return apiRequest(`/api/wellness/user/${userId}?${qs.toString()}`);
}

export async function fetchDashboard(userId) {
  return apiRequest(`/api/dashboard/${userId}`);
}

/* --------------------------------------------------------------------------
 * User Profile
 * -------------------------------------------------------------------------- */
export async function fetchUserProfile(userId) {
  return apiRequest(`/api/users/${userId}`);
}

export async function updateUserProfile(userId, profileData) {
  return apiRequest(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

/* --------------------------------------------------------------------------
 * Habits & Completions
 * -------------------------------------------------------------------------- */
export async function fetchUserHabits(userId) {
  return apiRequest(`/api/habits/user/${userId}`);
}

export async function createHabit(habitData) {
  return apiRequest('/api/habits', {
    method: 'POST',
    body: JSON.stringify(habitData),
  });
}

export async function updateHabit(habitId, habitData) {
  return apiRequest(`/api/habits/${habitId}`, {
    method: 'PUT',
    body: JSON.stringify(habitData),
  });
}

export async function deleteHabit(habitId) {
  return apiRequest(`/api/habits/${habitId}`, {
    method: 'DELETE',
  });
}

export async function completeHabitToday(habitId) {
  return apiRequest(`/api/completions/${habitId}`, {
    method: 'POST',
  });
}

export async function fetchHabitCompletions(habitId) {
  return apiRequest(`/api/completions/habit/${habitId}`);
}

/* --------------------------------------------------------------------------
 * Experiments
 * -------------------------------------------------------------------------- */
export async function fetchUserExperiments(userId) {
  return apiRequest(`/api/experiments/user/${userId}`);
}

export async function createExperiment(experimentData) {
  return apiRequest('/api/experiments', {
    method: 'POST',
    body: JSON.stringify(experimentData),
  });
}

export async function updateExperiment(experimentId, experimentData) {
  return apiRequest(`/api/experiments/${experimentId}`, {
    method: 'PUT',
    body: JSON.stringify(experimentData),
  });
}

export async function updateExperimentStatus(experimentId, status) {
  return apiRequest(`/api/experiments/${experimentId}/status?status=${encodeURIComponent(status)}`, {
    method: 'PATCH',
  });
}

export async function deleteExperiment(experimentId) {
  return apiRequest(`/api/experiments/${experimentId}`, {
    method: 'DELETE',
  });
}

/* --------------------------------------------------------------------------
 * Analytics
 * -------------------------------------------------------------------------- */
export async function fetchHabitStreaks(userId) {
  return apiRequest(`/api/analytics/habits/${userId}/streaks`);
}

export async function fetchHabitTodayAnalytics(userId) {
  return apiRequest(`/api/analytics/habits/${userId}/today`);
}

export async function fetchWeeklyHabitAnalytics(userId) {
  return apiRequest(`/api/analytics/habits/${userId}/weekly`);
}

export async function fetchHealthAnalyticsSummary(userId) {
  return apiRequest(`/api/analytics/health/${userId}/summary`);
}

export async function fetchCrossDomainInsights(userId) {
  return apiRequest(`/api/analytics/cross-domain/${userId}/insights`);
}

export async function fetchExperimentEvaluation(experimentId) {
  return apiRequest(`/api/analytics/experiments/${experimentId}/evaluation`);
}
