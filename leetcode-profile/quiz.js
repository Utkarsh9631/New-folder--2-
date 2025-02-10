// Sample easy questions
const easyQuestions = [
    {
        id: 1,
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        difficulty: "easy"
    },
    {
        id: 2,
        title: "Palindrome Number",
        description: "Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same forward and backward.",
        difficulty: "easy"
    },
    {
        id: 3,
        title: "Valid Parentheses",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.",
        difficulty: "easy"
    }
];

let currentQuestionIndex = 0;

// Function to display current question
function displayQuestion() {
    const question = easyQuestions[currentQuestionIndex];
    document.getElementById('question-title').textContent = question.title;
    document.getElementById('question-description').textContent = question.description;
    
    // Update button states
    document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
    document.getElementById('next-btn').disabled = currentQuestionIndex === easyQuestions.length - 1;
}

// Function to update heatmap data
function updateHeatmap() {
    const today = new Date().toISOString().split('T')[0];
    
    // Get existing activity data from localStorage
    const activityData = new Map(JSON.parse(localStorage.getItem('activityData')) || []);
    
    // Increment today's count
    const currentCount = activityData.get(today) || 0;
    activityData.set(today, currentCount + 1);
    
    // Save updated data
    localStorage.setItem('activityData', JSON.stringify([...activityData]));

    // Dispatch storage event for index.html to detect
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'activityData',
        newValue: JSON.stringify([...activityData])
    }));
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    displayQuestion();

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentQuestionIndex < easyQuestions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        }
    });

    document.getElementById('submit-btn').addEventListener('click', () => {
        const answer = document.getElementById('answer-input').value.trim();
        if (answer) {
            updateHeatmap();
            alert('Answer submitted successfully! Your contribution has been recorded.');
            document.getElementById('answer-input').value = '';
        } else {
            alert('Please provide an answer before submitting.');
        }
    });
}); 