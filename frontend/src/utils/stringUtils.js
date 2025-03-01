export const splitSentences = (text) => {
  return text.split(/(?<!\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|a\.m|p\.m|etc|vs|i\.e|e\.g|Jan|Feb|Aug|Sep|Oct|Nov|Dec|Ph\.D|U\.S|U\.K|E\.U))(?<=[.!?])["”]*(?=\s+[A-Z"“]|$)/g)
    .map(s => s.trim())
    .filter(Boolean);
};
