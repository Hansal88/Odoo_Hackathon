const PlaceImageCache = require('../models/PlaceImageCache');
const { cloudinaryCloudName, unsplashAccessKey } = require('../config/env');

const WIKIPEDIA_SUMMARY_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary';
const UNSPLASH_SEARCH_URL = 'https://api.unsplash.com/search/photos';
const FALLBACK_IMAGE_URL =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80';

function normalizePlaceName(placeName) {
  return String(placeName || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function buildCloudinaryFetchUrl(sourceUrl) {
  if (!cloudinaryCloudName || !sourceUrl) {
    return sourceUrl;
  }

  return `https://res.cloudinary.com/${cloudinaryCloudName}/image/fetch/f_auto,q_auto,c_limit,w_1600/${encodeURIComponent(sourceUrl)}`;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    const message = body ? `${response.status} ${body.slice(0, 180)}` : `${response.status} ${response.statusText}`;
    const error = new Error(`Request failed for ${url}: ${message}`);
    error.statusCode = response.status;
    throw error;
  }

  return response.json();
}

async function searchWikipediaImage(placeName) {
  const summaryUrl = `${WIKIPEDIA_SUMMARY_URL}/${encodeURIComponent(placeName)}`;
  const data = await fetchJson(summaryUrl, {
    headers: {
      Accept: 'application/json',
    },
  });

  const sourceUrl = data?.originalimage?.source || data?.thumbnail?.source || '';

  if (!sourceUrl) {
    return null;
  }

  return {
    provider: 'wikipedia',
    sourceUrl,
    pageUrl: data?.content_urls?.desktop?.page || '',
    title: data?.title || placeName,
    description: data?.extract || '',
    photographer: '',
  };
}

async function searchUnsplashImage(placeName) {
  if (!unsplashAccessKey) {
    return null;
  }

  const searchUrl = new URL(UNSPLASH_SEARCH_URL);
  searchUrl.searchParams.set('query', placeName);
  searchUrl.searchParams.set('per_page', '1');
  searchUrl.searchParams.set('orientation', 'landscape');

  const data = await fetchJson(searchUrl.toString(), {
    headers: {
      Authorization: `Client-ID ${unsplashAccessKey}`,
      'Accept-Version': 'v1',
    },
  });

  const photo = data?.results?.[0];

  if (!photo?.urls) {
    return null;
  }

  return {
    provider: 'unsplash',
    sourceUrl: photo.urls.full || photo.urls.regular || photo.urls.raw,
    pageUrl: photo.links?.html || '',
    title: photo.alt_description || photo.description || placeName,
    description: photo.description || photo.alt_description || '',
    photographer: photo.user?.name || '',
  };
}

function buildFallbackPayload(placeName) {
  return {
    provider: 'fallback',
    sourceUrl: FALLBACK_IMAGE_URL,
    pageUrl: '',
    title: placeName,
    description: 'Fallback travel image',
    photographer: 'Unsplash',
  };
}

async function saveCache(placeName, payload) {
  const normalizedPlace = normalizePlaceName(placeName);
  const imageUrl = buildCloudinaryFetchUrl(payload.sourceUrl);
  const now = new Date();

  const updated = await PlaceImageCache.findOneAndUpdate(
    { normalizedPlace },
    {
      placeName,
      normalizedPlace,
      provider: payload.provider,
      sourceUrl: payload.sourceUrl,
      imageUrl,
      pageUrl: payload.pageUrl || '',
      title: payload.title || placeName,
      description: payload.description || '',
      photographer: payload.photographer || '',
      fetchedAt: now,
      lastAccessedAt: now,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return updated.toObject();
}

async function getPlaceImage(placeName) {
  const trimmedPlace = String(placeName || '').trim();

  if (!trimmedPlace) {
    const error = new Error('placeName is required');
    error.statusCode = 400;
    throw error;
  }

  const normalizedPlace = normalizePlaceName(trimmedPlace);
  const cached = await PlaceImageCache.findOne({ normalizedPlace });

  if (cached) {
    cached.lastAccessedAt = new Date();
    await cached.save();
    return {
      ...cached.toObject(),
      cached: true,
    };
  }

  let payload = null;

  try {
    payload = await searchWikipediaImage(trimmedPlace);
  } catch (error) {
    if (error.statusCode && error.statusCode !== 404) {
      throw error;
    }
  }

  if (!payload) {
    try {
      payload = await searchUnsplashImage(trimmedPlace);
    } catch (error) {
      payload = null;
    }
  }

  if (!payload) {
    payload = buildFallbackPayload(trimmedPlace);
  }

  const saved = await saveCache(trimmedPlace, payload);

  return {
    ...saved,
    cached: false,
  };
}

module.exports = {
  getPlaceImage,
  normalizePlaceName,
  buildCloudinaryFetchUrl,
};