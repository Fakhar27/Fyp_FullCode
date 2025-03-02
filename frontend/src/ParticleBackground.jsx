import React, { useCallback } from 'react';
import Particles from "react-particles";
import { loadStarsPreset } from "tsparticles-preset-stars";
import { useTheme } from '@mui/material/styles';

const ParticleBackground = () => {
    const theme = useTheme();
    const particleColor = theme.palette.mode === 'dark' ? '#ffffff' : '#000000';
    const backgroundColor = theme.palette.mode === 'dark' ? '#000000' : '#ffffff';

    const particlesInit = useCallback(async (engine) => {
        await loadStarsPreset(engine);
    }, []);

    const particlesLoaded = useCallback(async (container) => {
        if (container && !window.particlesLogged) {
            console.log('Particles loaded:', container);
            window.particlesLogged = true;
        }
    }, []);

    const particleOptions = {
        preset: "stars",
        background: {
            color: {
                value: backgroundColor,
            },
        },
        particles: {
            color: { value: particleColor },
            line_linked: { color: particleColor },
            number: { value: 160, density: { enable: true, value_area: 800 } },
            size: { value: 3, random: true },
            opacity: { value: 0.5, random: true },
            move: { enable: true, speed: 1, random: true }
        }
    };

    return (
        <Particles
    id="tsparticles"
    init={particlesInit}
    loaded={particlesLoaded}
    options={particleOptions}
    style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0, 
    }}
/>
    );
};

export default ParticleBackground;