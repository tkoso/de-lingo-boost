import React from 'react';
import { splitSentences } from '../utils/stringUtils';


const GermanStory = ({ text, wordTranslations, cachedTranslations, onWordClick, hoveredSentence, setHoveredSentence }) => {
  const sentences = splitSentences(text);
  const currentTranslations = new Map(
    JSON.parse(wordTranslations)?.words?.map(w => [w.de.toLowerCase(), w.en]) || []
  );

  return sentences.map((sentence, sentenceIndex) => (
    <span
      key={sentenceIndex}
      className="sentence"
      onMouseEnter={() => setHoveredSentence(sentenceIndex)}
      onMouseLeave={() => setHoveredSentence(-1)}
      style={{
        backgroundColor: hoveredSentence === sentenceIndex ? '#f1e99f' : 'transparent',
        transition: 'background-color 0.2s ease',
      }}
    >
      {sentence.split(/(\s+)/).map((wordOrSpace, wordIndex) => {
        if (/\s+/.test(wordOrSpace)) {
          return <span key={wordIndex}>{wordOrSpace}</span>;
        }
        const cleanWord = wordOrSpace.replace(/[^a-zA-ZäöüÄÖÜß]/g, '').toLowerCase();
        const translation = currentTranslations.get(cleanWord.toLowerCase())
          || cachedTranslations.get(cleanWord.toLowerCase()) || '';
        return (
          <span
            key={wordIndex}
            className="clickable-word"
            onClick={(e) => onWordClick(e, cleanWord, translation)}
            style={{
                cursor: translation ? 'pointer' : 'default',
                textDecoration: translation ? 'underline dotted' : 'none',
            }}
          >
            {wordOrSpace}{' '}
          </span>
        );
      })}
    </span>
  ))
}

export default GermanStory;