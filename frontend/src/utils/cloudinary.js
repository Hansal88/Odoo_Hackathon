const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'ddqfoevdm';

const SAMPLE_IMAGE_URLS = {
  'cld-sample-1': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Manali_jan.jpg',
  'cld-sample-2': 'https://upload.wikimedia.org/wikipedia/commons/1/13/KokyoFushimiYaguraM1070.jpg',
  'cld-sample-3': 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Manali_2022.jpg',
  'cld-sample-4': 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Donna_Paula%2C_Goa.jpg',
  'cld-sample-5': 'https://upload.wikimedia.org/wikipedia/commons/0/03/Panjim_Downtown.JPG',
  'cld-sample-6': 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Kathakali_BNC.jpg',
  'cld-sample-7': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Goa_Memorial.JPG',
};

function isFullUrl(value) {
  return /^https?:\/\//i.test(String(value || ''));
}

function resolveSourceUrl(publicId) {
  if (!publicId) return '';
  if (isFullUrl(publicId)) return publicId;
  return SAMPLE_IMAGE_URLS[publicId] || '';
}

function buildTransform(options = {}) {
  const { width = 1200, height = 900, crop = 'fill' } = options;
  return `f_auto,q_auto,c_${crop},g_auto,w_${width},h_${height}`;
}

function buildFetchUrl(sourceUrl, options = {}) {
  return `https://res.cloudinary.com/${cloudName}/image/fetch/${buildTransform(options)}/${encodeURIComponent(sourceUrl)}`;
}

function buildUploadUrl(publicId, options = {}) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${buildTransform(options)}/${publicId}`;
}

export function getCloudinaryUrl(publicId, options = {}) {
  const sourceUrl = resolveSourceUrl(publicId);

  if (sourceUrl) {
    return buildFetchUrl(sourceUrl, options);
  }

  return buildUploadUrl(publicId, options);
}
