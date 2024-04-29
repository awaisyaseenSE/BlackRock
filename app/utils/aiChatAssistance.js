import React from 'react';
import constants from '../constants/constants';

const chatGptEndPoint = 'https://api.openai.com/v1/chat/completions';
const dalleEndPoint = 'https://api.openai.com/v1/images/generations';

export const apiCallOpenAi = async (prompt, messages) => {
  const apiKey = 'sk-proj-X0rKBW0my42Nrjf1EbIfT3BlbkFJof1MFP2X3mPq01Z2twpD';
  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: 'what is the meaning of ocean?',
        },
      ],
    }),
  };

  try {
    const response = await fetch(chatGptEndPoint, requestOptions);
    console.log(response?.status);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('data: ', data);
    // return { success: true, data };
  } catch (error) {
    console.log('error in apiCallOpenAi: ', error);
    return {success: false, message: error.message};
  }
};
