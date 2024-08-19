import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const LazyImage: React.FC<{
  src: string;
  alt: string;
  defaultSrc: string;
  styleCustom?: any;
}> = ({ src, alt, defaultSrc, styleCustom }) => {
  console.log("styleCustom", styleCustom);
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(defaultSrc);
  };

  return (
    <LazyLoadImage
      src={imgSrc}
      alt={alt}
      onError={handleError}
      effect="blur"
      {...styleCustom}
    />
  );
};
export default LazyImage;
