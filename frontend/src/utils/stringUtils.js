export const splitSentences = (text) => {
    // we will be splitting on sentence endings followed by whitespace
    return text.split(/(?<=[.!?])\s+/);
};
