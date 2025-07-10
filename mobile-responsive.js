document.addEventListener('DOMContentLoaded', function() {
    const questionCards = document.querySelectorAll('.question-card');
    const submitTestBtn = document.getElementById('submitTestBtn');
    const resultsCard = document.getElementById('resultsCard');
    const tryAgainBtn = document.getElementById('tryAgainBtn'); 
    
    const selectedAnswers = {}; // Stores {cardIndex: selectedOptionIndex}

    questionCards.forEach((card, cardIndex) => {
        const viewAnswerBtn = card.querySelector('.view-answer-btn');
        const answerBox = card.querySelector('.answer-box');
        const explanationBox = card.querySelector('.explanation-box');
        const options = card.querySelectorAll('.option');
        const correctAnswerIndex = parseInt(card.dataset.correctAnswer); 

        options.forEach(option => {
            option.addEventListener('click', function() {
                // When a new option is selected, clear all previous states (selected, correct, wrong)
                options.forEach(opt => opt.classList.remove('selected', 'correct', 'wrong')); 
                // Add 'selected' class to the newly clicked option
                this.classList.add('selected');
                // Store the selected answer's index for this card
                selectedAnswers[cardIndex] = parseInt(this.dataset.optionIndex);
            });
        });

        // Event listener for the "View Answer" button for individual question
        if (viewAnswerBtn) {
            viewAnswerBtn.addEventListener('click', function() {
                // Show the answer and explanation boxes
                if (answerBox) answerBox.style.display = 'block';
                if (explanationBox) explanationBox.style.display = 'block';
                
                // Hide the "View Answer" button
                this.style.display = 'none';

                // Apply styling based on correct/wrong answers
                options.forEach(option => {
                    const optionIndex = parseInt(option.dataset.optionIndex);
                    
                    // Clear existing 'selected' class to ensure correct/wrong colors take precedence
                    option.classList.remove('selected'); 

                    if (optionIndex === correctAnswerIndex) {
                        // If this option is the correct answer, make it green
                        option.classList.add('correct'); 
                    } else if (selectedAnswers[cardIndex] === optionIndex) {
                        // If user selected THIS option AND it's not the correct one, make it red
                        option.classList.add('wrong');
                    }
                });

                // Disable further clicks on options after viewing answer for this specific question
                options.forEach(option => option.style.pointerEvents = 'none');
            });
        }
    });

    // Event listener for the "Submit Test" (View Results) button
    if (submitTestBtn) {
        submitTestBtn.addEventListener('click', function() {
            let totalQuestions = questionCards.length;
            let attemptedQuestions = 0;
            let correctAnswers = 0;
            let wrongAnswers = 0;

            // Loop through each question card to evaluate answers and apply styling for all
            questionCards.forEach((card, cardIndex) => {
                const correctAnswerIndex = parseInt(card.dataset.correctAnswer);
                const userAnswerIndex = selectedAnswers[cardIndex]; // User's selected answer for this question
                const options = card.querySelectorAll('.option');

                // Check if the user attempted this question for scoring
                if (userAnswerIndex !== undefined) {
                    attemptedQuestions++;
                    if (userAnswerIndex === correctAnswerIndex) {
                        correctAnswers++;
                    } else {
                        wrongAnswers++;
                    }
                }

                // Apply styling to options based on final evaluation
                options.forEach(option => {
                    const optionIndex = parseInt(option.dataset.optionIndex);
                    // Disable further interaction for all options after submit
                    option.style.pointerEvents = 'none'; 

                    // Clear all previous states (selected, correct, wrong) before applying new ones
                    option.classList.remove('selected', 'correct', 'wrong'); 
                    
                    if (optionIndex === correctAnswerIndex) {
                        // Always highlight the correct answer in green
                        option.classList.add('correct');
                    } 
                    // If user selected this option AND it's not the correct one, mark it wrong
                    else if (userAnswerIndex === optionIndex) { 
                        option.classList.add('wrong'); // Mark user's wrong choice in red
                    }
                });

                // Hide individual 'View Answer' button after final submission
                const viewAnsBtn = card.querySelector('.view-answer-btn');
                if(viewAnsBtn) viewAnsBtn.style.display = 'none';

                // Ensure explanation and answer text are shown for all questions on submit
                const explanationBox = card.querySelector('.explanation-box');
                const answerBox = card.querySelector('.answer-box');
                if (answerBox) answerBox.style.display = 'block';
                if (explanationBox) explanationBox.style.display = 'block';
            });

            // Display results in the results card
            document.getElementById('totalQuestions').textContent = totalQuestions;
            document.getElementById('attemptedQuestions').textContent = attemptedQuestions;
            document.getElementById('correctAnswers').textContent = correctAnswers;
            document.getElementById('wrongAnswers').textContent = wrongAnswers;
            document.getElementById('yourScore').textContent = correctAnswers;
            document.getElementById('maxScore').textContent = totalQuestions;

            let message = '';
            if (totalQuestions > 0 && correctAnswers === totalQuestions) { 
                message = "Excellent! All answers are correct.";
            } else if (correctAnswers === 0 && attemptedQuestions === 0) {
                message = "You haven't attempted any questions yet!";
            } else if (correctAnswers >= totalQuestions / 2) {
                message = "Good job! Keep practicing!";
            } else {
                message = "Keep practicing to improve!";
            }
            document.getElementById('resultsMessage').textContent = message;

            // Show the results card
            resultsCard.style.display = 'block';
            // Hide the submit button after results are shown
            submitTestBtn.style.display = 'none';

            // Scroll to the top of the results card
            if (resultsCard) {
                resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Event listener for the "Try Again" button
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
            location.reload(); // Simply reload the page to reset the quiz
        });
    }
});
