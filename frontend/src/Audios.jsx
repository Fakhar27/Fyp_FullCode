import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress,
  Paper
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';

export default function Audios() {
  const [prompt, setPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAudioUrl('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/generate-voice/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        // Convert base64 to audio blob
        const audioData = atob(data.audio_data);
        const arrayBuffer = new ArrayBuffer(audioData.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        
        for (let i = 0; i < audioData.length; i++) {
          uint8Array[i] = audioData.charCodeAt(i);
        }
        
        const blob = new Blob([arrayBuffer], { type: data.content_type });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } else {
        setError(data.error || 'Failed to generate audio');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Paper className="p-6 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Enter your prompt"
            variant="outlined"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
            multiline
            rows={3}
          />
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={!prompt || isLoading}
            className="mt-4"
          >
            {isLoading ? <CircularProgress size={24} /> : 'Generate Audio'}
          </Button>
        </form>

        {error && (
          <Alert severity="error" className="mt-4">
            {error}
          </Alert>
        )}

        {audioUrl && !error && (
          <Box className="mt-4">
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </Box>
        )}
      </Paper>
    </Box>
  );
}