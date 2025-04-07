let exerciseHistory = [];

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

function updateSetLabels() {
    const sets = document.querySelectorAll('.set-list .set');
    sets.forEach((set, index) => {
        const label = set.querySelector('label');
        if (label) {
            label.textContent = `Set ${index + 1}:`;
        }
    });
}

function logExercise(event) {
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
        id: new Date().getTime(),
        name: exerciseName,
        sets: sets,
        date: new Date().toISOString().split('T')[0] // Add current date in YYYY-MM-DD format
    };
    
    exerciseHistory.push(newExercise);
    console.log(exerciseHistory);
    
    // Reset form
    form.reset();
    
    // Save to storage and update UI
    saveToStorage();
    renderWorkoutLog();
}


/* Older function before user was able to add different number of sets and select weight units
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
    
    newExercise.id = new Date();
    exerciseHistory.push(newExercise);
    
    console.log(exerciseHistory);
    
    const formButton = document.querySelector('form button');
    formButton.textContent = "Add Exercise";

    // Optionally, hide the form after submission
    // document.querySelector('form').style.display = 'none';

    document.querySelector('form').reset();

    saveToStorage();
    renderWorkoutLog();
}
*/

function renderWorkoutLog() {
    let workoutLogHTML = '';

    if (exerciseHistory === undefined || exerciseHistory.length == 0) {
        const defaultHTML = '<p>Workout Log Empty</p>';
        workoutLogHTML += defaultHTML;   
    } else {
        exerciseHistory.forEach((exercise) => {
            setsHTML = '';
            
            exercise.sets.forEach((set) => {
                setsHTML += `Set ${set.setNumber}: ${set.weight} ${set.unit} for ${set.reps} reps<br>`;
            });
            
            
            const newHTML = 
            `
                <p>
                <strong>${exercise.name}</strong>:<br>
                ${setsHTML}
                </p>

                <div id="itemActions">
                    <i onclick="editExercise('${exercise.id}')" class="fa-solid fa-pen-to-square"></i>
                    <i onclick="deleteExercise('${exercise.id}')" class="fa-solid fa-trash"></i>
                </div>
            `;
            workoutLogHTML += newHTML;       
        });
    }
    document.querySelector('.js-workout-log').innerHTML = workoutLogHTML;
}

//Delete exercise based on its ID
function deleteExercise(exerciseId) {
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

//Edit exercise based on its ID
function editExercise(exerciseId) {

    exerciseHistory.forEach((exercise) => {
        if(exercise.id == exerciseId){
            const form = document.querySelector('form');
            form.style.display = 'block';
            form.querySelector('input[name="name"]').value = exercise.name;
            form.querySelector('input[name="sets"]').value = exercise.sets;
            form.querySelector('input[name="reps"]').value = exercise.reps;
            form.querySelector('input[name="weight"]').value = exercise.weight;
            form.querySelector('button').textContent = "Update Exercise";
            deleteExercise(exercise.id);
        }
    });
}

//Display current date on landing page and later use it to load relevant exercise history
function currentDate() {
    const dateToday = new Date();
    const dateString = dateToday.toDateString();

    const dateHTML = 
    `
    <h3>${dateString}</h3>
    `;

    document.querySelector('.date').innerHTML = dateHTML;
}

//Toggle the input fields from hidden to block
function showInputsFields() {
    const userInputs = document.querySelector('.userInputs');
    userInputs.style.display = userInputs.style.display === 'none' ? 'block' : 'none';
}