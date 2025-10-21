
import React, { useState } from 'react';

interface InputBarProps {
  onUserInput: (input: string) => void;
  isLoading: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onUserInput, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onUserInput(input.trim());
      setInput('');
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-900/50 backdrop-blur-sm border-t border-green-900">
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you do?"
          disabled={isLoading}
          className="flex-grow bg-gray-800 text-green-300 placeholder-green-700 border border-green-700 rounded-md p-3 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:opacity-50 transition-all"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 text-gray-900 font-bold px-6 py-3 rounded-md hover:bg-green-500 disabled:bg-green-800 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default InputBar;
