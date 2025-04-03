let exerciseHistory = [];

let exerciseData = {};

function logExercise(event){
    event.preventDefault(); 
    
    const form = event.target.form;
    const inputs = document.querySelectorAll('form input');
    
    const newExercise = {};
    
    inputs.forEach(input => {
        if (input.value.trim() !== '') {
            if (input.name === 'sets' || input.name === 'reps' || input.name === 'weight') {
                newExercise[input.name] = Number(input.value);
            } else {
                newExercise[input.name] = input.value;
            }
        } else {
            newExercise[input.name] = exerciseData[input.name];
        }
    });
    
    newExercise.timestamp = new Date();
    exerciseHistory.push(newExercise);
    form.reset();
    updateWorkoutLog();
}

function updateWorkoutLog() {
    const workoutLog = document.querySelector('.workout-log');
    workoutLog.innerHTML = '';
    
    exerciseHistory.forEach((exercise, index) => {
        const exerciseEntry = document.createElement('div');
        exerciseEntry.className = 'exercise-entry';
        exerciseEntry.innerHTML = `
            <p><strong>${exercise.name}</strong>: ${exercise.sets} sets x ${exercise.reps} reps @ ${exercise.weight} lbs</p>
        `;
        workoutLog.appendChild(exerciseEntry);
    });
}