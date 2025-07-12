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

    // Check if the page was reloaded with a hash for scrolling (optional, but good practice)
    // If you want to use URL hash like #firstQuestion, uncomment and adjust this:
    // if (window.location.hash === '#firstQuestion') {
    //     scrollToFirstQuestion();
    // }

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
                if (answerBox) answerBox.style.display = 'block';
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
                if (answerBox) answerBox.style.display = 'block';
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
                message = "Excellent! All answers are correct.";
            } else if (correctAnswers === 0 && attemptedQuestions === 0) {
                message = "You haven't attempted any questions yet!";
            } else if (correctAnswers >= totalQuestions / 2) {
                message = "Good job! Keep practicing!";
            } else {
                message = "Keep practicing to improve!";
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
            // Reload the page
            location.reload(); 
            // Once the page is reloaded, DOMContentLoaded will fire again,
            // and the quiz state will be reset.
            // We can then immediately scroll to the first question.
            // This part of the code will execute AFTER the reload, so it won't scroll immediately.
            // To make it scroll after reload, we might need to use localStorage or URL hash.
            // A simpler approach for direct refresh is often preferred by browsers:
            // The browser usually scrolls to the top on reload unless a hash is present.
            // We will add a small timeout to ensure the DOM is ready after reload for scroll.
            setTimeout(scrollToFirstQuestion, 100); // 100ms delay to ensure render
        });
    }

    // Initial scroll to the top of the first question card when the page loads
    // This ensures that even on first load, if the user scrolled down,
    // they can start from the first question.
    scrollToFirstQuestion(); 
});
