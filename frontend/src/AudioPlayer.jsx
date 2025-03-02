import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const CustomAudioPlayer = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    return () => {
      audio.removeEventListener('loadedmetadata', () => setDuration(audio.duration));
      audio.removeEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (event, newValue) => {
    audioRef.current.currentTime = newValue;
    setCurrentTime(newValue);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Box sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <audio ref={audioRef} src={audioUrl} />
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
        <IconButton onClick={handlePlayPause} sx={{ mr: 1 }}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <Slider
          value={currentTime}
          onChange={handleSliderChange}
          max={duration}
          sx={{ 
            color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&:before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
              },
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px ${
                  theme => theme.palette.mode === 'dark'
                    ? 'rgb(255 255 255 / 16%)'
                    : 'rgb(0 0 0 / 16%)'
                }`,
              },
              '&.Mui-active': {
                width: 20,
                height: 20,
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.28,
            },
          }}
        />
      </Box>
      <Typography variant="caption" sx={{ alignSelf: 'flex-end' }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </Typography>
    </Box>
  );
};

export default CustomAudioPlayer;