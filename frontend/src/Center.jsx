import React, { useState, useEffect, useContext, useRef } from 'react';
import { Box, Card, CardContent, CardMedia, TextField, Button, Typography, Grid, Alert } from '@mui/material';
import { useTypewriter,Typewriter } from 'react-simple-typewriter';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AuthContext from "./utils/AuthContext";
import CustomAudioPlayer from './AudioPlayer';

const genres = ['Horror', 'Adventure', 'Fantasy'];

const genrePrompts = {
  Horror: ['A creaky old mansion with a dark secret', 'A misty forest where shadows move on their own'],
  Adventure: ['A hidden temple deep in the jungle', 'A treacherous mountain pass leading to an unknown land'],
  Fantasy: ['A dragon egg about to hatch in a wizard tower', 'A portal to another world hidden in plain sight']
};

export default function Center() {
    const [author, setAuthor] = useState("");
    const { authTokens, logout, errorMessage, seterrorMessage } = useContext(AuthContext);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [story, setStory] = useState('');
    const [phase, setPhase] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        getUserDetails();
    }, []);

    let getUserDetails = async () => {
        if (!authTokens) {
            logout();
            return;
        }
        try {
            let response = await fetch('http://localhost:8000/user/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authTokens.access
                }
            });
            let data = await response.json();

            if (response.status === 200) {
                setAuthor(data.username); 
            } else if (response.status === 401) {
                logout();
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const [welcomeText] = useTypewriter({
        words: [`WELCOME ${author}`],
        loop: 1, 
        typeSpeed: 95,
        deleteSpeed: 50,
        delaySpeed: 1000
    });  

    const generateContent = async (prompt) => {
        try {
            setLoading(true);
            seterrorMessage("");

            const response = await fetch("http://localhost:8000/generate-content/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + authTokens.access
                },
                body: JSON.stringify({ prompt, genre: selectedGenre }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
        
            if (data.image_data && data.story) {
                setImageData(data.image_data);
                setStory(data.story);
                console.log("HERE IS THE STORY GENERATED: ",data.story);
                // setEnhancedPrompt(data.enhanced_prompt || "");
                setPhase(3);
                await generateVoice(data.story);
            } else {
                throw new Error("No image data or story received");
            }
        } catch (error) {
            console.error("An error occurred during content generation:", error);
            seterrorMessage("SORRY! YOUR REQUEST TO OUR SERVERS WENT BAD, PLEASE TRY AGAIN IN A SHORT WHILE");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {  
            seterrorMessage("PROMPT CANNOT BE EMPTY");
            return;
        }
        await generateContent(prompt);
    };

    const generateVoice = async (text) => {
        try {
            const response = await fetch("http://localhost:8000/generate-voice/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + authTokens.access
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const audioBlob = new Blob([new Uint8Array(data.audio_data.split('').map(c => c.charCodeAt(0)))], { type: data.content_type });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl);
        } catch (error) {
            console.error("An error occurred during voice generation:", error);
            seterrorMessage("SORRY! VOICE GENERATION FAILED, PLEASE TRY AGAIN LATER");
        }
    };

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre);
        setPhase(2);
        seterrorMessage(""); // Clear any previous error messages
    };

    const handleManualSubmit = () => {
        if (prompt.trim()) {
            handleGenerate();
        } else {
            seterrorMessage("PROMPT CANNOT BE EMPTY");
        }
    };

    const resetAndGoToPhase1 = () => {
        setPhase(1);
        setSelectedGenre(null);
        setImageData(null);
        setPrompt("");
        seterrorMessage("");
    };

    const handleBack = () => {
        resetAndGoToPhase1();
    };

    return (
        <Box 
            sx={{ 
                position: 'relative', 
                width: '100%', 
                minHeight: '100vh', 
                overflowY: 'auto',
                overflowX: 'hidden',
                pt: 10, 
                px: { xs: 2, sm: 3, md: 0 }  
            }}
            // sx={{ 
            //     position: 'relative', 
            //     width: '100%', 
            //     minHeight: '100vh', 
            //     overflowY: 'auto',
            //     overflowX: 'hidden',
            //     pt: 8,
            //     px: { xs: 2, sm: 3, md: 0 }  
            // }}
        >
            <ParticleBackground />
            <Box 
                sx={{ 
                    minHeight: 'calc(100vh - 64px)',
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1,
                    color: theme => theme.palette.text.primary,
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={phase}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                        style={{ width: '100%', maxWidth: '500px' }}
                    >
                        {phase === 3 && imageData && story && (
                            <>
                                <CardMedia
                                    component="img"
                                    image={`data:image/png;base64,${imageData}`}
                                    alt="Generated Image"
                                    sx={{
                                        height: 'auto',
                                        width: '100%',
                                        objectFit: 'contain',
                                        backgroundColor: 'transparent'
                                    }}
                                />
                                <Card sx={{ 
                                    backgroundColor: theme => theme.palette.background.paper,
                                    color: theme => theme.palette.text.primary,
                                    mt:2,
                                    p: 1,
                                    borderRadius: '4px',
                                    minHeight: '100px',  
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Typography
                                    sx={{
                                        fontFamily: "'Courier New', Courier, monospace",
                                        fontSize: '1.2rem',
                                        lineHeight: 1.6,
                                        letterSpacing: '0.05em',
                                        textShadow: theme => theme.palette.mode === 'dark' ? '0 0 5px rgba(255,255,255,0.5)' : '0 0 5px rgba(0,0,0,0.5)',
                                        '& .Typewriter__cursor': {
                                        color: theme => theme.palette.primary.main,
                                        }
                                    }}
                                    >
                                    <Typewriter
                                        words={[story]}
                                        loop={1}
                                        typeSpeed={80}
                                        deleteSpeed={50}
                                        delaySpeed={1000}
                                    />
                                    </Typography>
                                </Card>
                                {/* {audioUrl && (
                                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                        <audio ref={audioRef} src={audioUrl} />
                                        <Button
                                            onClick={handlePlayPause}
                                            startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                                            variant="contained"
                                            sx={{
                                                borderRadius: '50%',
                                                minWidth: '56px',
                                                width: '56px',
                                                height: '56px',
                                                padding: 0,
                                            }}
                                        />
                                    </Box>
                                )} */}
                                {audioUrl && (
                                    <CustomAudioPlayer audioUrl={audioUrl} />
                                )}
                                <Button
                                    onClick={resetAndGoToPhase1}
                                    startIcon={<ArrowBackIcon />}
                                    fullWidth
                                    sx={{
                                        mt: 2,
                                        mb: 4,
                                        borderRadius: '8px',
                                        transition: 'all 0.3s',
                                        color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
                                        backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                                        '&:hover': {
                                            transform: 'translateX(-3px)',
                                            backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.16)',
                                        },
                                    }}
                                >
                                    Start Over
                                </Button>
                            </>
                        )}

                        {phase !== 3 && (
                            
                            <Card sx={{ 
                                width: '100%', 
                                maxWidth: '500px', 
                                mb: 4,
                                backgroundColor: theme => theme.palette.background.paper,
                                color: theme => theme.palette.text.primary,
                            }}>
                                <CardContent>
                                    {phase === 1 && (
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                            <Typography 
                                                    variant="h4" 
                                                    gutterBottom 
                                                    sx={{ 
                                                        color: theme => theme.palette.text.primary,
                                                        mb: 1,
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {welcomeText}
                                                </Typography>
                                                <Typography variant="h6" gutterBottom sx={{ color: theme => theme.palette.text.primary }}>
                                                    Choose a Genre
                                                </Typography>
                                                {genres.map((genre) => (
                                                    <Button 
                                                        key={genre} 
                                                        onClick={() => handleGenreSelect(genre)} 
                                                        fullWidth 
                                                        sx={{ 
                                                            mb: 1, 
                                                            borderRadius: '8px',
                                                            transition: 'all 0.3s',
                                                            color: theme => theme.palette.mode === 'dark' ? 'white' : 'black',
                                                            backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                                                            '&:hover': {
                                                                transform: 'translateY(-3px)',
                                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                                                                backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.16)',
                                                            }
                                                        }}
                                                    >
                                                        {genre}
                                                    </Button>
                                                ))}
                                            </Grid>
                                        </Grid>
                                    )}

                                    {phase === 2 && (
                                        <>
                                            {errorMessage && (
                                                <Alert severity="error" sx={{ mb: 2 }}>
                                                    {errorMessage}
                                                </Alert>
                                            )}
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                placeholder={genrePrompts[selectedGenre][Math.floor(Math.random() * genrePrompts[selectedGenre].length)]}
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                                sx={{ 
                                                    mb: 2,
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                                                        },
                                                        '&:hover fieldset': {
                                                            borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: theme => theme.palette.primary.main,
                                                        },
                                                    },
                                                    '& .MuiInputBase-input': {
                                                        color: theme => theme.palette.text.primary,
                                                    },
                                                }}
                                                inputProps={{
                                                    sx: {
                                                        '&::placeholder': {
                                                            fontSize: {
                                                                xs: '0.875rem',  
                                                                sm: '1rem',      
                                                            },
                                                            color: theme => theme.palette.text.secondary,
                                                        }
                                                    }
                                                }}
                                                disabled={loading}
                                            />
                                            <Button
                                                onClick={handleManualSubmit} 
                                                variant="contained" 
                                                fullWidth
                                                disabled={loading}
                                                sx={{
                                                    py: { xs: 1.5, sm: 2 },  
                                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                                    color: (theme) => theme.palette.mode === 'dark' ? 'black !important' : 'white !important', 
                                                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'white' : 'black', 
                                                    '&:hover': {
                                                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)', 
                                                    },
                                                    mb: 2,
                                                }}
                                            >
                                                {loading ? 'Generating...' : 'Generate Content'}
                                            </Button>
                                            <Button
                                                onClick={resetAndGoToPhase1}
                                                startIcon={<ArrowBackIcon />}
                                                fullWidth
                                                sx={{
                                                    borderRadius: '8px',
                                                    transition: 'all 0.3s',
                                                    color: theme => theme.palette.text.primary,
                                                    '&:hover': {
                                                        transform: 'translateX(-3px)',
                                                        backgroundColor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                                                    },
                                                }}
                                            >
                                                Back to Genres
                                            </Button>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>
                </AnimatePresence>
            </Box>
        </Box>
    );
}
