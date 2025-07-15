document.addEventListener('DOMContentLoaded', function() {
    const questionCards = document.querySelectorAll('.question-card');
    const submitTestBtn = document.getElementById('submitTestBtn');
    const resultsCard = document.getElementById('resultsCard');
    const tryAgainBtn = document.getElementById('tryAgainBtn'); 
    
    const selectedAnswers = {}; // Stores {cardIndex: selectedOptionIndex}

    // Function to scroll to the first question
    function scrollToFirstQuestion() {
        if (questionCards.length > 0) {
            questionCards[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    questionCards.forEach((card, cardIndex) => {
        const viewAnswerBtn = card.querySelector('.view-answer-btn');
        const answerBox = card.querySelector('.answer-box'); 
        const explanationBox = card.querySelector('.explanation-box');
        const options = card.querySelectorAll('.option');
        const correctAnswerIndex = parseInt(card.dataset.correctAnswer); 

        options.forEach(option => {
            option.addEventListener('click', function() {
                options.forEach(opt => opt.classList.remove('selected', 'correct', 'wrong')); 
                this.classList.add('selected');
                selectedAnswers[cardIndex] = parseInt(this.dataset.optionIndex);
            });
        });

        if (viewAnswerBtn) {
            viewAnswerBtn.addEventListener('click', function() {
                // Remove the line below to hide the 'Correct Answer' box
                // if (answerBox) answerBox.style.display = 'block'; 
                
                if (explanationBox) explanationBox.style.display = 'block';
                
                this.style.display = 'none';

                options.forEach(option => {
                    const optionIndex = parseInt(option.dataset.optionIndex);
                    
                    option.classList.remove('selected'); 

                    if (optionIndex === correctAnswerIndex) {
                        option.classList.add('correct'); 
                    } else if (selectedAnswers[cardIndex] === optionIndex) {
                        option.classList.add('wrong');
                    }
                });

                options.forEach(option => option.style.pointerEvents = 'none');
            });
        }
    });

    if (submitTestBtn) {
        submitTestBtn.addEventListener('click', function() {
            let totalQuestions = questionCards.length;
            let attemptedQuestions = 0;
            let correctAnswers = 0;
            let wrongAnswers = 0;

            questionCards.forEach((card, cardIndex) => {
                const correctAnswerIndex = parseInt(card.dataset.correctAnswer);
                const userAnswerIndex = selectedAnswers[cardIndex]; 
                const options = card.querySelectorAll('.option');

                if (userAnswerIndex !== undefined) {
                    attemptedQuestions++;
                    if (userAnswerIndex === correctAnswerIndex) {
                        correctAnswers++;
                    } else {
                        wrongAnswers++;
                    }
                }

                options.forEach(option => {
                    const optionIndex = parseInt(option.dataset.optionIndex);
                    option.style.pointerEvents = 'none'; 
                    option.classList.remove('selected', 'correct', 'wrong'); 
                    
                    if (optionIndex === correctAnswerIndex) {
                        option.classList.add('correct');
                    } 
                    else if (userAnswerIndex === optionIndex) { 
                        option.classList.add('wrong'); 
                    }
                });

                const viewAnsBtn = card.querySelector('.view-answer-btn');
                if(viewAnsBtn) viewAnsBtn.style.display = 'none';

                const explanationBox = card.querySelector('.explanation-box');
                const answerBox = card.querySelector('.answer-box');
                // Remove the line below to hide the 'Correct Answer' box
                // if (answerBox) answerBox.style.display = 'block';
                if (explanationBox) explanationBox.style.display = 'block';
            });

            document.getElementById('totalQuestions').textContent = totalQuestions;
            document.getElementById('attemptedQuestions').textContent = attemptedQuestions;
            document.getElementById('correctAnswers').textContent = correctAnswers;
            document.getElementById('wrongAnswers').textContent = wrongAnswers;
            document.getElementById('yourScore').textContent = correctAnswers;
            document.getElementById('maxScore').textContent = totalQuestions;

            let message = '';
            if (totalQuestions > 0 && correctAnswers === totalQuestions) { 
                message = "Excellent ! All answers are correct";
            } else if (correctAnswers === 0 && attemptedQuestions === 0) {
                message = "You haven't attempted any questions yet";
            } else if (correctAnswers >= totalQuestions / 2) {
                message = "Good job ! Keep practicing";
            } else {
                message = "Keep practicing to improve";
            }
            document.getElementById('resultsMessage').textContent = message;

            resultsCard.style.display = 'block';
            submitTestBtn.style.display = 'none';

            if (resultsCard) {
                resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Event listener for the "Try Again" button
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
            location.reload(); 
            setTimeout(scrollToFirstQuestion, 100); 
        });
    }

    scrollToFirstQuestion(); 
});
