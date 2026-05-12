import { getCloudinaryUrl } from '../../utils/cloudinary';

export default function CloudinaryImage({ publicId, src, alt = '', className = '', width = 1200, height = 900, ...props }) {
  if (!src && !publicId) {
    return null;
  }

  const imageSrc = src || getCloudinaryUrl(publicId, { width, height });

  return <img src={imageSrc} alt={alt} className={className} loading="lazy" decoding="async" {...props} />;
}
