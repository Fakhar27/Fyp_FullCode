import React, { useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

const ImageDisplay = ({ imageUrl }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = (e) => {
    console.error("Image load error:", e);
    setLoading(false);
    setError(true);
  };

  if (!imageUrl) {
    return null;
  }

  return (
    <Box 
      sx={{ 
        position: 'relative',
        width: '100%',
        height: '300px',
        backgroundColor: 'background.paper',
        borderRadius: 1,
        overflow: 'hidden'
      }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <CircularProgress />
        </Box>
      )}
      
      <img
        src={imageUrl}
        alt="Generated content"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: loading ? 'none' : 'block'
        }}
      />
      
      {error && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper',
            color: 'text.secondary'
          }}
        >
          Failed to load image
        </Box>
      )}
    </Box>
  );
};

export default ImageDisplay;