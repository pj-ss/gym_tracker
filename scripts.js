let exerciseHistory = [];

loadFromStorage();
renderWorkoutLog();

function loadFromStorage(){
    exerciseHistory = JSON.parse(localStorage.getItem('history'));
}

function saveToStorage(){
    localStorage.setItem('history', JSON.stringify(exerciseHistory));
}

function logExercise(event){
    event.preventDefault(); 

    loadFromStorage();
    
    const form = event.target.form;
    const inputs = document.querySelectorAll('form input');

    // Check if any field is empty
    let hasEmptyFields = false;
    inputs.forEach((input) => {
        if (input.value.trim() === '') {
            hasEmptyFields = true;
        }
    });
    
    // Don't proceed if any field is empty
    if (hasEmptyFields) {
        alert("Please fill in all fields");
        return;
    }
    
    const newExercise = {};
    inputs.forEach((input) => {
        newExercise[input.name] = input.value;
    });
    
   // newExercise.timestamp = new Date();
    exerciseHistory.push(newExercise);
    
    console.log(exerciseHistory);
    
    form.reset();
    saveToStorage();
    renderWorkoutLog();
}

function renderWorkoutLog() {
    let workoutLogHTML = '';
    
    exerciseHistory.forEach((exercise) => {
        const newHTML = 
        `
            <p><strong>${exercise.name}</strong>: ${exercise.sets} sets x ${exercise.reps} reps @ ${exercise.weight} lbs</p>
        `;
        workoutLogHTML += newHTML;       
    });

    document.querySelector('.js-workout-log').innerHTML = workoutLogHTML;
}
