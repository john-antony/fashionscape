import React, { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { useNavigate } from 'react-router-dom';

export default function Masonry(props) {
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    navigate(`/image/${index}`);
  }

  return (
    <div style={{ columns: props.columnCount, gutter: 0 }}>
      {props.images.map((img, i) => (
        <div
          key={i}
          className="image-container"
          onMouseEnter={() => setSelectedImageIndex(i)}
          onMouseLeave={() => setSelectedImageIndex(null)}
          style={{ padding: props.gap / 2 }}
        >
          <img
            src={img.imageURL}
            alt=""
            className="image"
            onClick={() => handleImageClick(i)}
          />
          {selectedImageIndex === i && <FavoriteBorderOutlinedIcon className="favorite-icon" fontSize='large'/>}
        </div>
      ))}
    </div>
  );
}
