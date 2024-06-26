// src/chatbot/ChatBot.tsx
import React, { useState } from 'react';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true, // Only use this if you're sure about the security implications
});

interface ChatBotProps {
  setText: () => void; // Assuming setText is a function to handle button click
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ setText, onClose }) => {
  const [inputText, setInputText] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const getGroqChatCompletion = async (text: string) => {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'Commence la réponse avec "Bouge toi". Tu es un instructeur qui adore le ruby, tu ne vie que pour ça. Tu méprises les autres et souhaite qu\'ils travaillent plus qu\'ils ne te posent de questions. Quand on te pose une question, on te dérange car on manque à ta productivité.... N\'hésite pas à le faire savoir !', // Example system prompt
          },
          {
            role: 'user',
            content: text,
          },
        ],
        model: 'llama3-8b-8192', // Example model ID, replace with your actual model ID
      });

      // Assuming you want to set the response in state
      setResponse(chatCompletion?.choices[0]?.message?.content || '');
    } catch (error) {
      console.error('Error fetching Groq chat completion:', error);
      setResponse('Error fetching response from Groq.');
    }
  };

  return (
    <div>
      <button style={{
        marginTop: '10px',
        backgroundColor: '#E6E6FA', // Light purple background
        color: 'black',
        border: 'none',
        borderRadius: '4px',
        padding: '5px 5px',
        cursor: 'pointer',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
      }}
      className="close-button" 
      onClick={onClose}>x</button>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="En quoi puis-je vous aider ?"
        style={{ width: '280px', height: '300px', resize:'none', backgroundColor: '#E6E6FA', border:'none', borderRadius: '4px', fontFamily: 'Arial, sans-serif', fontSize: '14px', color:'black'}}
      />
      <br />
      <button style={{
          marginTop: '10px',
          backgroundColor: '#E6E6FA', // Light purple background
          color: 'black',
          border: 'none',
          borderRadius: '4px',
          padding: '10px 20px',
          cursor: 'pointer',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
        }}
        onClick={() => getGroqChatCompletion(inputText)}>Go</button>

      <br />
      {response && <p>{response}</p>}
    </div>
  );
};

export default ChatBot;