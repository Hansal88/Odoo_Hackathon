const asyncHandler = require('../utils/asyncHandler');
const { getPlaceImage } = require('../services/placeImageService');

exports.getPlaceImage = asyncHandler(async (req, res) => {
  const placeName = req.query.place || req.body?.place || '';
  const image = await getPlaceImage(placeName);

  res.status(200).json({
    success: true,
    message: image.cached ? 'Place image loaded from cache' : `Place image loaded from ${image.provider}`,
    data: {
      placeName: image.placeName,
      provider: image.provider,
      imageUrl: image.imageUrl,
      sourceUrl: image.sourceUrl,
      pageUrl: image.pageUrl,
      title: image.title,
      description: image.description,
      photographer: image.photographer,
      cached: image.cached,
      fetchedAt: image.fetchedAt,
      lastAccessedAt: image.lastAccessedAt,
    },
  });
});