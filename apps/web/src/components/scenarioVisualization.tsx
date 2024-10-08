import React, { useEffect, useState } from 'react';
import { useImageGeneratorDex } from '@/hooks/useImageGeneratorDex';

const ScenarioVisualization = ({ currentStep, getThemeClass }: any) => {
  const {
    images,
    isGenerating,
    generateImage,
    generationStatus,
    setCurrentMessageId,
    currentCallId,
    checkExistingImage,
  } = useImageGeneratorDex();

  const [isImageExisting, setIsImageExisting] = useState(false);

  useEffect(() => {
    if (currentStep.id) {
      setCurrentMessageId(currentStep.id);
      checkExistingImage(currentStep.id).then((existingImage) => {
        setIsImageExisting(!!existingImage);
      });
    }
  }, [currentStep.id, setCurrentMessageId, checkExistingImage]);

  const handleGenerateImage = async () => {
    if (currentStep.gameState && !isImageExisting) {
      const imagePrompt = `${currentStep.gameState.Title}: ${currentStep.gameState.Challenge}`;
      await generateImage(currentStep.id, imagePrompt);
    }
  };

  return (
    <div className='mt-4'>
      {images[currentStep.id] ? (
        <img
          src={images[currentStep.id]}
          alt='Generated scenario'
          className='w-full max-w-md mx-auto rounded-lg shadow-lg mb-4'
        />
      ) : (
        <div className='flex flex-col items-center space-y-4'>
          <button
            onClick={handleGenerateImage}
            disabled={isGenerating || isImageExisting}
            className={`
              ${getThemeClass(
                'bg-green-700 hover:bg-green-600 border-green-400',
                'bg-cyan-700 hover:bg-cyan-600 border-[#00bcbcd9]'
              )}
              text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg border-2
              ${isGenerating || isImageExisting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isGenerating
              ? 'Generating...'
              : isImageExisting
                ? 'Image Available'
                : 'Generate Visualization'}
          </button>
          {isGenerating && (
            <div className='flex flex-col items-center text-center'>
              <p className={getThemeClass('text-green-300', 'text-cyan-300')}>
                {generationStatus}
              </p>
              {currentCallId && (
                <p className={getThemeClass('text-green-200', 'text-cyan-200')}>
                  Call ID: {currentCallId}
                </p>
              )}
              <div className='mt-2'>
                <div
                  className={getThemeClass(
                    'animate-spin rounded-full h-8 w-8 border-b-2 border-green-500',
                    'animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500'
                  )}
                ></div>
              </div>
            </div>
          )}
          {!isGenerating && generationStatus.includes('Error') && (
            <p className='text-red-500'>{generationStatus}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScenarioVisualization;
