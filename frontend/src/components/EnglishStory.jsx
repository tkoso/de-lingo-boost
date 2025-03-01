import React from 'react';
import { splitSentences } from '../utils/stringUtils'; 

const EnglishStory = ({ text, hoveredSentence, setHoveredSentence }) => {
    const sentences = splitSentences(text);
    return sentences.map((sentence, index) => (
      <span
        key={index}
        className="sentence"
        onMouseEnter={() => setHoveredSentence(index)}
        onMouseLeave={() => setHoveredSentence(-1)}
        style={{
          backgroundColor: hoveredSentence === index ? '#f1e99f' : 'transparent',
          transition: 'background-color 0.2s ease',
        }}
      >
        {sentence}{' '}
      </span>
    ));
}

export default EnglishStory;