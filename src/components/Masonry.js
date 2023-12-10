import React, { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';

export default function Masonry(props) {
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div style={{ columns: props.columnCount, gutter: 0 }}>
      {props.imageUrls.map((img, i) => (
        <div
          key={i}
          className="image-container"
          onClick={() => navigate('/image')}
          onMouseEnter={() => setHoverIndex(i)}
          onMouseLeave={() => setHoverIndex(null)}
          style={{ padding: props.gap / 2 }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/fits/${img.url}`}
            alt=""
            className="image"
          />
          {hoverIndex === i && <FavoriteIcon className="favorite-icon" fontSize='large'/>}
        </div>
      ))}
    </div>
  );
}
