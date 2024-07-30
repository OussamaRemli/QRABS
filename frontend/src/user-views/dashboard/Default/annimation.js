// AnimatedImage.js
import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../../assets/images/Animation.json'; // Chemin vers votre fichier JSON d'animation

const AnimatedImage = () => {
  const defaultOptions = {
    loop: true, // Choisissez si l'animation doit boucler
    autoplay: true, // Choisissez si l'animation doit commencer automatiquement
    animationData: animationData, // Données de l'animation
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return <Lottie options={defaultOptions}   style={{
    width:'65%' ,
    height:  '65%' 
}} />;
};

export default AnimatedImage;
