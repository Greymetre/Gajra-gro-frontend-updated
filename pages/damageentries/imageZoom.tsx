// components/ImageViewer.tsx

import React from 'react';
import ReactPanZoom from 'react-image-pan-zoom-rotate';
import { IMAGE_URL } from '../../utils/constant';

const ImageViewer: React.FC<{ src: string }> = ({ src }) => {
  return (
    <div style={{ width: '400px', height: '300px', overflow: 'hidden' }}>
   <ReactPanZoom
      image={IMAGE_URL + src}
      alt="Image alt text"
    />
    </div>
  );
};

export default ImageViewer;
