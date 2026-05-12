const STORAGE_PREFIX = 'traveloop-trips';
const USER_STORAGE_KEY = 'traveloop-user';

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getTripStorageKey(userKey) {
  return `${STORAGE_PREFIX}:${userKey || 'guest'}`;
}

function getUserKey(user = getCurrentUser()) {
  return user?.email || user?.userId || 'guest';
}

export function loadStoredTrips(user = getCurrentUser()) {
  try {
    const storageKey = getTripStorageKey(getUserKey(user));
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredTrips(trips, user = getCurrentUser()) {
  const storageKey = getTripStorageKey(getUserKey(user));
  localStorage.setItem(storageKey, JSON.stringify(trips));
}

export function addStoredTrip(trip, user = getCurrentUser()) {
  const trips = loadStoredTrips(user);
  const nextTrip = {
    ...trip,
    userKey: getUserKey(user),
  };
  const nextTrips = [nextTrip, ...trips];
  saveStoredTrips(nextTrips, user);
  return nextTrip;
}

export function getStoredTripById(id, user = getCurrentUser()) {
  const trips = loadStoredTrips(user);
  return trips.find(trip => String(trip.id) === String(id)) || null;
}

export function clearStoredTrips(user = getCurrentUser()) {
  localStorage.removeItem(getTripStorageKey(getUserKey(user)));
}
