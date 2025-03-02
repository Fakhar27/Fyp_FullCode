import React, { useState, useContext } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Grid, 
  Alert,
  MenuItem,
  Container,
  CircularProgress,
  IconButton
} from '@mui/material';
import { useTypewriter } from 'react-simple-typewriter';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DownloadIcon from '@mui/icons-material/Download';
import AuthContext from "./utils/AuthContext";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

const genres = ['Horror', 'Adventure', 'Fantasy'];

const VideoPlayer = ({ videoData }) => {
  if (!videoData) return null;

  const videoSrc = `data:video/mp4;base64,${videoData}`;

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <video 
        controls 
        width="100%" 
        style={{ borderRadius: '8px' }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
};

export default function ContentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [genre, setGenre] = useState('Adventure');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);
  const { authTokens } = useContext(AuthContext);
  
  const [titleText] = useTypewriter({
    words: ['AI Story Reel Generator'],
    loop: 1
  });

  const downloadVideo = () => {
    if (!videoData) return;

    const element = document.createElement('a');
    element.href = `data:video/mp4;base64,${videoData}`;
    element.download = 'story_reel.mp4';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateContent = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError(null);
    setVideoData(null);
    
    try {
      const response = await fetch('http://localhost:8000/generate-content/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({
          prompt,
          genre,
          iterations: 4
        })
      });

      if (!response.ok) {
        throw new Error('Content generation failed');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.video_data) {
        setVideoData(data.video_data);
      } else {
        throw new Error('No video data received');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', pt: 4, pb: 8 }}>
      <ParticleBackground />
      
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h3" 
            align="center" 
            gutterBottom
            sx={{ 
              color: 'primary.main',
              fontWeight: 'bold',
              mb: 4 
            }}
          >
            {titleText}
          </Typography>

          <Card 
            elevation={6}
            sx={{ 
              mb: 4, 
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)' 
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Enter your story prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={loading}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    disabled={loading}
                    variant="outlined"
                  >
                    {genres.map((g) => (
                      <MenuItem key={g} value={g}>
                        {g}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={generateContent}
                    disabled={loading || !prompt.trim()}
                    sx={{ height: '56px' }}
                    startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
                  >
                    {loading ? 'Generating Story Reel...' : 'Generate Story Reel'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Alert severity="error" sx={{ mb: 4 }}>
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {videoData && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Card 
                elevation={6}
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}>
                    <Typography variant="h5">
                      Your Story Reel
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={downloadVideo}
                    >
                      Download
                    </Button>
                  </Box>
                  <VideoPlayer videoData={videoData} />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  );
}















// import React, { useState, useEffect, useContext, useRef } from 'react';
// import { 
//   Box, 
//   Card, 
//   CardContent, 
//   TextField, 
//   Button, 
//   Typography, 
//   Grid, 
//   Alert,
//   MenuItem,
//   Container,
//   CircularProgress,
//   IconButton
// } from '@mui/material';
// import { useTypewriter } from 'react-simple-typewriter';
// import { motion, AnimatePresence } from 'framer-motion';
// import ParticleBackground from './ParticleBackground';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import VolumeUpIcon from '@mui/icons-material/VolumeUp';
// import PauseIcon from '@mui/icons-material/Pause';
// import AuthContext from "./utils/AuthContext";
// import ImageDisplay from './ImageDisplay';

// const containerVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0 }
// };

// const cardVariants = {
//   hidden: { opacity: 0, scale: 0.9 },
//   visible: { opacity: 1, scale: 1 }
// };

// const genres = ['Horror', 'Adventure', 'Fantasy'];

// const AudioPlayer = ({ audioData }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef(new Audio());

//   useEffect(() => {
//     if (audioData) {
//       audioRef.current.src = `data:audio/wav;base64,${audioData}`;
//     }
//   }, [audioData]);

//   useEffect(() => {
//     const audio = audioRef.current;
    
//     const handleEnded = () => setIsPlaying(false);
//     audio.addEventListener('ended', handleEnded);
    
//     return () => {
//       audio.removeEventListener('ended', handleEnded);
//       audio.pause();
//       audio.currentTime = 0;
//     };
//   }, []);

//   const togglePlay = () => {
//     if (isPlaying) {
//       audioRef.current.pause();
//     } else {
//       audioRef.current.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   return (
//     <IconButton onClick={togglePlay} disabled={!audioData}>
//       {isPlaying ? <PauseIcon /> : <VolumeUpIcon />}
//     </IconButton>
//   );
// };

// export default function ContentGenerator() {
//   const [prompt, setPrompt] = useState('');
//   const [genre, setGenre] = useState('Adventure');
//   const [loading, setLoading] = useState(false);
//   const [iterations, setIterations] = useState([]);
//   const [error, setError] = useState(null);
//   const { authTokens } = useContext(AuthContext);
  
//   const [titleText] = useTypewriter({
//     words: ['Creative Content Generator'],
//     loop: 1
//   });

//   useEffect(() => {
//     if (iterations.length > 0) {
//       console.log('Current iterations:', iterations);
//     }
//   }, [iterations]);

//   const generateContent = async () => {
//     if (!prompt.trim()) {
//       setError('Please enter a prompt');
//       return;
//     }

//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await fetch('http://localhost:8000/generate-content/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer ' + String(authTokens.access)
//         },
//         body: JSON.stringify({
//           prompt,
//           genre,
//           iterations: 4
//         })
//       });

//       if (!response.ok) {
//         throw new Error('Content generation failed');
//       }

//       const data = await response.json();
//       console.log('Received data:', data);
      
//       if (data.error) {
//         throw new Error(data.error);
//       }

//       if (data.results && Array.isArray(data.results)) {
//         setIterations(data.results);
//       } else {
//         throw new Error('Invalid response format');
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ position: 'relative', minHeight: '100vh', pt: 4, pb: 8 }}>
//       <ParticleBackground />
      
//       <Container maxWidth="xl">
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           variants={containerVariants}
//           transition={{ duration: 0.5 }}
//         >
//           <Typography 
//             variant="h3" 
//             align="center" 
//             gutterBottom
//             sx={{ 
//               color: 'primary.main',
//               fontWeight: 'bold',
//               mb: 4 
//             }}
//           >
//             {titleText}
//           </Typography>

//           <Card 
//             elevation={6}
//             sx={{ 
//               mb: 4, 
//               background: 'rgba(255, 255, 255, 0.9)',
//               backdropFilter: 'blur(10px)' 
//             }}
//           >
//             <CardContent sx={{ p: 4 }}>
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="Enter your story prompt"
//                     value={prompt}
//                     onChange={(e) => setPrompt(e.target.value)}
//                     disabled={loading}
//                     variant="outlined"
//                   />
//                 </Grid>
                
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     select
//                     fullWidth
//                     label="Genre"
//                     value={genre}
//                     onChange={(e) => setGenre(e.target.value)}
//                     disabled={loading}
//                     variant="outlined"
//                   >
//                     {genres.map((g) => (
//                       <MenuItem key={g} value={g}>
//                         {g}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>
                
//                 <Grid item xs={12} sm={6}>
//                   <Button
//                     fullWidth
//                     variant="contained"
//                     onClick={generateContent}
//                     disabled={loading || !prompt.trim()}
//                     sx={{ height: '56px' }}
//                     startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
//                   >
//                     {loading ? 'Generating...' : 'Generate Content'}
//                   </Button>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>

//           <AnimatePresence>
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//               >
//                 <Alert severity="error" sx={{ mb: 4 }}>
//                   {error}
//                 </Alert>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <Grid container spacing={3}>
//             {iterations.map((iteration, index) => (
//               <Grid item xs={12} md={6} key={index}>
//                 <motion.div
//                   variants={cardVariants}
//                   initial="hidden"
//                   animate="visible"
//                   transition={{ delay: index * 0.2 }}
//                 >
//                   <Card 
//                     elevation={6}
//                     sx={{ 
//                       height: '100%',
//                       background: 'rgba(255, 255, 255, 0.9)',
//                       backdropFilter: 'blur(10px)'
//                     }}
//                   >
//                     <CardContent>
//                       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
//                         <Typography variant="h5">
//                           Draft {iteration.iteration}
//                         </Typography>
//                         <AudioPlayer audioData={iteration.voice_data} />
//                       </Box>
                      
//                       {iteration.image_url && (
//                         <Box mb={2}>
//                           <ImageDisplay imageUrl={iteration.image_url.startsWith('data:') ? iteration.image_url : `data:image/jpeg;base64,${iteration.image_url}`} />
//                         </Box>
//                       )}
                      
//                       <Typography variant="h6" gutterBottom>
//                         Story:
//                       </Typography>
//                       <Typography paragraph>
//                         {iteration.story}
//                       </Typography>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               </Grid>
//             ))}
//           </Grid>
//         </motion.div>
//       </Container>
//     </Box>
//   );
// }













// // import React, { useState, useEffect, useContext } from 'react';
// // import { 
// //   Box, 
// //   Card, 
// //   CardContent, 
// //   TextField, 
// //   Button, 
// //   Typography, 
// //   Grid, 
// //   Alert,
// //   MenuItem,
// //   Container,
// //   CircularProgress 
// // } from '@mui/material';
// // import { useTypewriter } from 'react-simple-typewriter';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import ParticleBackground from './ParticleBackground';
// // import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// // import AuthContext from "./utils/AuthContext";
// // import ImageDisplay from './ImageDisplay';

// // // Animation variants
// // const containerVariants = {
// //   hidden: { opacity: 0, y: 20 },
// //   visible: { opacity: 1, y: 0 }
// // };

// // const cardVariants = {
// //   hidden: { opacity: 0, scale: 0.9 },
// //   visible: { opacity: 1, scale: 1 }
// // };

// // const genres = ['Horror', 'Adventure', 'Fantasy'];

// // export default function ContentGenerator() {
// //   const [prompt, setPrompt] = useState('');
// //   const [genre, setGenre] = useState('Adventure');
// //   const [loading, setLoading] = useState(false);
// //   const [iterations, setIterations] = useState([]);
// //   const [error, setError] = useState(null);
// //   const { authTokens } = useContext(AuthContext);
  
// //   const [titleText] = useTypewriter({
// //     words: ['Creative Content Generator'],
// //     loop: 1
// //   });

// //   useEffect(() => {
// //     if (iterations.length > 0) {
// //       console.log('Current iterations:', iterations);
// //     }
// //   }, [iterations]);

// //   const generateContent = async () => {
// //     if (!prompt.trim()) {
// //       setError('Please enter a prompt');
// //       return;
// //     }

// //     setLoading(true);
// //     setError(null);
    
// //     try {
// //       console.log('Sending request with:', { prompt, genre });
// //       const response = await fetch('http://localhost:8000/generate-content/', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Authorization': 'Bearer ' + String(authTokens.access)
// //         },
// //         body: JSON.stringify({
// //           prompt,
// //           genre,
// //           iterations: 4
// //         })
// //       });

// //       if (!response.ok) {
// //         throw new Error('Content generation failed');
// //       }

// //       const data = await response.json();
// //       console.log('Received data:', data);
      
// //       if (data.error) {
// //         throw new Error(data.error);
// //       }

// //       if (data.results && Array.isArray(data.results)) {
// //         setIterations(data.results);
// //       } else {
// //         throw new Error('Invalid response format');
// //       }
// //     } catch (err) {
// //       console.error('Error:', err);
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <Box sx={{ position: 'relative', minHeight: '100vh', pt: 4, pb: 8 }}>
// //       <ParticleBackground />
      
// //       <Container maxWidth="xl">
// //         <motion.div
// //           initial="hidden"
// //           animate="visible"
// //           variants={containerVariants}
// //           transition={{ duration: 0.5 }}
// //         >
// //           <Typography 
// //             variant="h3" 
// //             align="center" 
// //             gutterBottom
// //             sx={{ 
// //               color: 'primary.main',
// //               fontWeight: 'bold',
// //               mb: 4 
// //             }}
// //           >
// //             {titleText}
// //           </Typography>

// //           <Card 
// //             elevation={6}
// //             sx={{ 
// //               mb: 4, 
// //               background: 'rgba(255, 255, 255, 0.9)',
// //               backdropFilter: 'blur(10px)' 
// //             }}
// //           >
// //             <CardContent sx={{ p: 4 }}>
// //               <Grid container spacing={3}>
// //                 <Grid item xs={12}>
// //                   <TextField
// //                     fullWidth
// //                     label="Enter your story prompt"
// //                     value={prompt}
// //                     onChange={(e) => setPrompt(e.target.value)}
// //                     disabled={loading}
// //                     variant="outlined"
// //                   />
// //                 </Grid>
                
// //                 <Grid item xs={12} sm={6}>
// //                   <TextField
// //                     select
// //                     fullWidth
// //                     label="Genre"
// //                     value={genre}
// //                     onChange={(e) => setGenre(e.target.value)}
// //                     disabled={loading}
// //                     variant="outlined"
// //                   >
// //                     {genres.map((g) => (
// //                       <MenuItem key={g} value={g}>
// //                         {g}
// //                       </MenuItem>
// //                     ))}
// //                   </TextField>
// //                 </Grid>
                
// //                 <Grid item xs={12} sm={6}>
// //                   <Button
// //                     fullWidth
// //                     variant="contained"
// //                     onClick={generateContent}
// //                     disabled={loading || !prompt.trim()}
// //                     sx={{ height: '56px' }}
// //                     startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
// //                   >
// //                     {loading ? 'Generating...' : 'Generate Content'}
// //                   </Button>
// //                 </Grid>
// //               </Grid>
// //             </CardContent>
// //           </Card>

// //           <AnimatePresence>
// //             {error && (
// //               <motion.div
// //                 initial={{ opacity: 0, y: -20 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 exit={{ opacity: 0, y: -20 }}
// //               >
// //                 <Alert severity="error" sx={{ mb: 4 }}>
// //                   {error}
// //                 </Alert>
// //               </motion.div>
// //             )}
// //           </AnimatePresence>

// //           <Grid container spacing={3}>
// //             {iterations.map((iteration, index) => (
// //               <Grid item xs={12} md={6} key={index}>
// //                 <motion.div
// //                   variants={cardVariants}
// //                   initial="hidden"
// //                   animate="visible"
// //                   transition={{ delay: index * 0.2 }}
// //                 >
// //                   <Card 
// //                     elevation={6}
// //                     sx={{ 
// //                       height: '100%',
// //                       background: 'rgba(255, 255, 255, 0.9)',
// //                       backdropFilter: 'blur(10px)'
// //                     }}
// //                   >
// //                     <CardContent>
// //                       <Typography variant="h5" gutterBottom>
// //                         Draft {iteration.iteration}
// //                       </Typography>
                      
// //                       {iteration.image_url && (
// //                         <Box mb={2}>
// //                           <ImageDisplay imageUrl={iteration.image_url.startsWith('data:') ? iteration.image_url : `data:image/jpeg;base64,${iteration.image_url}`} />
// //                         </Box>
// //                       )}
                      
// //                       <Typography variant="h6" gutterBottom>
// //                         Story:
// //                       </Typography>
// //                       <Typography paragraph>
// //                         {iteration.story}
// //                       </Typography>
                      
// //                       {/* <Typography variant="h6" gutterBottom>
// //                         Enhanced Story:
// //                       </Typography>
// //                       <Typography paragraph>
// //                         {iteration.enhanced_story}
// //                       </Typography> */}
// //                     </CardContent>
// //                   </Card>
// //                 </motion.div>
// //               </Grid>
// //             ))}
// //           </Grid>
// //         </motion.div>
// //       </Container>
// //     </Box>
// //   );
// // }