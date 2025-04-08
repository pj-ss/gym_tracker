let exerciseHistory = [];
let editingExerciseId = null;

//On page load
loadFromStorage();
renderWorkoutLog();
currentDate();

function loadFromStorage(){
    const stored = localStorage.getItem('history');
    exerciseHistory = stored 
        ? JSON.parse(stored) 
        : [];
}

function saveToStorage(){
    localStorage.setItem('history', JSON.stringify(exerciseHistory));
}

function addSet(event){
    event.preventDefault(); 
    const setList = document.querySelector('.set-list');
    const setCount = document.querySelectorAll('.set').length;

    const tempDiv = document.createElement('div');

    tempDiv.innerHTML = 
    `
    <div class="set set-${setCount+1}">
        <label for="setNumber">Set ${setCount+1}:</label>
        <input type="text" name="weight" placeholder="Weight">
        <select id="unit" name="unit">
            <option value="lbs">lbs</option>
            <option value="kg">kg</option>
        </select>
        <label>x</label>
        <input type="text" name="reps" placeholder="# of Reps">
        <label>Reps</label>
        <i onClick="removeSet(${setCount+1})" class="fa-solid fa-minus"></i>
    </div>
    `;

    const newSet = tempDiv.firstElementChild;
    setList.appendChild(newSet);
}

function removeSet(setNumber){
    const targetSet = document.querySelector(`.set-${setNumber}`);
    targetSet.remove();

    updateSetLabels();
}

function updateSetLabels(){
    const sets = document.querySelectorAll('.set-list .set');
    sets.forEach((set, index) => {
        const label = set.querySelector('label');
        if (label) {
            label.textContent = `Set ${index + 1}:`;
        }
    });
}

function logExercise(event){
    event.preventDefault();
    
    loadFromStorage();
    
    const form = document.querySelector('.userInputs');
    const exerciseName = form.querySelector('input[name="name"]').value.trim();
    
    // Check if exercise name is empty
    if (exerciseName === '') {
        alert("Please provide an exercise name");
        return;
    }
    
    // Get all set divs
    const setDivs = document.querySelectorAll('.set-list .set');
    
    // Get data for each set
    const sets = [];
    
    setDivs.forEach((setDiv, index) => {
        const weightInput = setDiv.querySelector('input[name="weight"]');
        const unitSelect = setDiv.querySelector('select[name="unit"]');
        const repsInput = setDiv.querySelector('input[name="reps"]');
        
        // Only add sets that have data
        if (weightInput && weightInput.value.trim() !== '' && 
            repsInput && repsInput.value.trim() !== '') {
            
            sets.push({
                setNumber: index + 1,
                weight: weightInput.value.trim(),
                unit: unitSelect ? unitSelect.value : 'lbs',
                reps: repsInput.value.trim()
            });
        }
    });
    
    // Check if at least one set has data
    if (sets.length === 0) {
        alert("Please fill in data for at least one set");
        return;
    }
    
    // Create the exercise object
    const newExercise = {
        id: editingExerciseId || new Date().getTime(),
        name: exerciseName,
        sets: sets,
        date: new Date().toISOString().split('T')[0] // Add current date in YYYY-MM-DD format
    };
    
    exerciseHistory.push(newExercise);
    console.log(exerciseHistory);
    
    // Reset form
    form.reset();
    editingExerciseId = null;
    document.getElementById('saveBtn').textContent = "Save Exercise";
    
    // Save to storage and render workoutlog again
    saveToStorage();
    renderWorkoutLog();
}

function renderWorkoutLog() {
    let workoutLogHTML = '';

    if (!exerciseHistory || exerciseHistory.length === 0) {
        workoutLogHTML = '<p>Workout Log Empty</p>';
    } else {
        workoutLogHTML += '<div class="exercise-list">'; // Container for all cards

        exerciseHistory.forEach((exercise) => {
            let setsHTML = '';

            exercise.sets.forEach((set) => {
                setsHTML += `
                    <div class="set-line">
                        Set ${set.setNumber}: ${set.weight} ${set.unit} for ${set.reps} reps
                    </div>
                `;
            });

            const newHTML = `
                <div class="exercise-card">
                    <div class="exercise-header">
                        <strong>${exercise.name}</strong>
                    </div>
                    <div class="exercise-sets">
                        ${setsHTML}
                    </div>
                    <div id="itemActions">
                        <i onclick="editExercise('${exercise.id}')" class="fa-solid fa-pen-to-square"></i>
                        <i onclick="deleteExercise('${exercise.id}')" class="fa-solid fa-trash"></i>
                    </div>
                </div>
            `;

            workoutLogHTML += newHTML;
        });

        workoutLogHTML += '</div>'; // End .exercise-list
    }

    document.querySelector('.js-workout-log').innerHTML = workoutLogHTML;
}


// Delete exercise based on its ID
function deleteExercise(exerciseId){
    const newExerciseHistory = [];

    exerciseHistory.forEach((exercise) => {
        if(String(exercise.id) !== String(exerciseId)){ //was previously trying to compare an object to a string
            newExerciseHistory.push(exercise);
        }
    });

    exerciseHistory = newExerciseHistory;
    saveToStorage();
    renderWorkoutLog();
}

// Edit exercise based on its ID
function editExercise(exerciseId){
    const exercise = exerciseHistory.find(e => String(e.id) === String(exerciseId));
    if (!exercise) return;

    const form = document.querySelector('form.userInputs');
    const setList = form.querySelector('.set-list');

    // Update button text
    document.getElementById('saveBtn').textContent = "Update Exercise";

    // Clear existing sets
    setList.innerHTML = '';

    // Show form
    form.style.display = 'block';

    // Set the name
    form.querySelector('input[name="name"]').value = exercise.name;

    // Add and populate sets
    exercise.sets.forEach((set, index) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `
        <div class="set set-${index+1}">
            <label for="setNumber">Set ${index+1}:</label>
            <input type="text" name="weight" value="${set.weight}" placeholder="Weight">
            <select name="unit">
                <option value="lbs" ${set.unit === 'lbs' ? 'selected' : ''}>lbs</option>
                <option value="kg" ${set.unit === 'kg' ? 'selected' : ''}>kg</option>
            </select>
            <label>x</label>
            <input type="text" name="reps" value="${set.reps}" placeholder="# of Reps">
            <label>Reps</label>
            <i onClick="removeSet(${index+1})" class="fa-solid fa-minus"></i>
        </div>
        `;
        setList.appendChild(tempDiv.firstElementChild);
    });

    // Set current editing ID
    editingExerciseId = exercise.id;

    // Remove the old entry (we'll save updated version when user clicks save)
    deleteExercise(exercise.id);
}

// Display current date on landing page and later use it to load relevant exercise history
function currentDate(){
    const dateToday = new Date();
    const dateString = dateToday.toDateString();

    const dateHTML = 
    `
    <h3>${dateString}</h3>
    `;

    document.querySelector('.date').innerHTML = dateHTML;
}

// Toggle the input fields from hidden to block
function showInputsFields(){
    const userInputs = document.querySelector('.userInputs');
    userInputs.style.display = userInputs.style.display === 'none' ? 'block' : 'none';
}