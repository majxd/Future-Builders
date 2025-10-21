
import React, { useEffect, useRef } from 'react';
import { Story, Role } from '../types';

interface StoryDisplayProps {
  story: Story;
  isLoading: boolean;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1 p-4 text-gray-400">
    <span>AI is thinking</span>
    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
  </div>
);

const StoryDisplay: React.FC<StoryDisplayProps> = ({ story, isLoading }) => {
  const endOfStoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfStoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [story]);

  return (
    <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
      {story.map((part, index) => (
        <div key={index} className="whitespace-pre-wrap animate-fade-in">
          {part.role === Role.USER ? (
            <div className="text-amber-300">
              <span className="font-bold">&gt; </span>{part.text}
            </div>
          ) : (
            <div className="text-green-400">{part.text}</div>
          )}
        </div>
      ))}
      {isLoading && story.length > 0 && <TypingIndicator />}
      <div ref={endOfStoryRef} />
    </div>
  );
};

export default StoryDisplay;
