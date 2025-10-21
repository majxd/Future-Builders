
import React, { useState, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { Story, Role, StoryPart } from './types';
import { createAdventureChat } from './services/geminiService';
import StoryDisplay from './components/StoryDisplay';
import InputBar from './components/InputBar';

const App: React.FC = () => {
  const [story, setStory] = useState<Story>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const chatRef = useRef<Chat | null>(null);

  const startGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      chatRef.current = createAdventureChat();
      const stream = await chatRef.current.sendMessageStream(
        "Start the game by describing the opening scene. The player has just woken up on a beach."
      );

      setGameStarted(true);
      
      let currentText = '';
      const modelResponsePart: StoryPart = { role: Role.MODEL, text: '' };
      setStory([modelResponsePart]);

      for await (const chunk of stream) {
        currentText += chunk.text;
        setStory([{ ...modelResponsePart, text: currentText }]);
      }

    } catch (e) {
      console.error(e);
      setError('Failed to start the adventure. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUserInput = useCallback(async (input: string) => {
    if (!chatRef.current) return;

    setIsLoading(true);
    setError(null);
    const userMessage: StoryPart = { role: Role.USER, text: input };
    const modelResponsePart: StoryPart = { role: Role.MODEL, text: '' };
    
    setStory(prevStory => [...prevStory, userMessage, modelResponsePart]);

    try {
      const stream = await chatRef.current.sendMessageStream(input);
      
      let currentText = '';
      for await (const chunk of stream) {
        currentText += chunk.text;
        setStory(prevStory => {
            const newStory = [...prevStory];
            newStory[newStory.length - 1] = { ...modelResponsePart, text: currentText };
            return newStory;
        });
      }
    } catch (e) {
      console.error(e);
      const errorMessage = 'The connection to the storyteller was lost. Please try again.';
      setError(errorMessage);
      setStory(prev => {
        const lastPart = prev[prev.length - 1];
        if (lastPart.role === Role.MODEL && lastPart.text === '') {
          return [...prev.slice(0, -1), {...lastPart, text: `[Error: ${errorMessage}]`}]
        }
        return [...prev, {role: Role.MODEL, text: `[Error: ${errorMessage}]`}]
      })
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const renderContent = () => {
    if (!gameStarted) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <h1 className="text-4xl md:text-6xl font-bold text-green-300 mb-4 animate-fade-in">Gemini Text Adventure</h1>
          <p className="text-lg md:text-xl text-green-500 mb-8 animate-fade-in [animation-delay:0.5s]">Survive on a deserted island using the power of science.</p>
          {error && <div className="text-red-400 mb-4 p-4 bg-red-900/50 border border-red-500 rounded-md">{error}</div>}
          <button 
            onClick={startGame} 
            disabled={isLoading}
            className="bg-green-600 text-gray-900 font-bold px-8 py-4 rounded-md hover:bg-green-500 disabled:bg-green-800 disabled:cursor-not-allowed transition-all text-xl animate-fade-in [animation-delay:1s]"
          >
            {isLoading ? 'Waking up...' : 'Start Adventure'}
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <header className="p-4 bg-gray-900/50 backdrop-blur-sm border-b border-green-900 text-center">
            <h1 className="text-2xl font-bold text-green-300">Island Survival</h1>
        </header>
        <StoryDisplay story={story} isLoading={isLoading} />
        {error && <div className="text-red-400 px-6 pb-2">{error}</div>}
        <InputBar onUserInput={handleUserInput} isLoading={isLoading} />
      </div>
    );
  }

  return (
    <main className="h-screen w-screen bg-gray-900 text-green-400 flex flex-col selection:bg-green-800 selection:text-green-200">
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
      {renderContent()}
    </main>
  );
};

export default App;
