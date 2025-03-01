import { Card, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Quiz = ({ questions, selectedAnswers, onAnswerSelect, showResults, onShowResults }) => {
  return (
    <div className="mt-4">
      <h3>Quiz</h3>
      {questions.map((q, qIndex) => (
        <Card key={qIndex} className="mb-3 quiz-question">
          <Card.Body>
            <Card.Text>
              {q.question}  
            </Card.Text>
            <div className="d-flex gap-2 flex-wrap">
              {Object.entries(q.options).map(([letter, option]) => (
                <Button
                  key={letter}
                  variant={getButtonVariant(qIndex, letter, q.correctAnswer)}
                  onClick={() => !showResults && onAnswerSelect(qIndex, letter)}
                  disabled = {showResults}
                  className="text-nowrap"
                >
                  {letter}) {option}
                </Button>
              ))}
            </div>
            {showResults && (
              <div className="mt-2 text-muted">
                Correct answer: {q.correctAnswer}
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
      <Button
        variant="secondary"
        onClick={onShowResults}
        disabled={Object.keys(selectedAnswers).length < questions.length}
      >
        {showResults ? "Hide results" : "Check answers"}
      </Button>
    </div>  
  );

  function getButtonVariant(qIndex, letter, correctAnswer) {
    if (!showResults) {
      return selectedAnswers[qIndex] === letter ? "primary" : "outline-primary";
    }

    if (letter === correctAnswer) return "success";
    if (selectedAnswers[qIndex] === letter) return "danger";
    return "outline-secondary";
  }
}

Quiz.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape({
    question: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    correctAnswer: PropTypes.string.isRequired
  })).isRequired,
  selectedAnswers: PropTypes.object.isRequired,
  onAnswerSelect: PropTypes.func.isRequired,
  showResults: PropTypes.bool.isRequired,
  onShowResults: PropTypes.func.isRequired
}

export default Quiz;