const addIngredientButton = document.querySelector('.add-ingredient');
const addPreparationStepButton = document.querySelector('.add-step');
const deleteForm = document.querySelector('#form-delete');

function addIngredient() {
    const ingredientsDiv = document.querySelector('#ingredients');
    const ingredientsInputs = document.querySelectorAll('#ingredients input');

    const newIngredient = ingredientsInputs[ingredientsInputs.length-1].cloneNode(true);

    if(newIngredient.value == '') return false;

    newIngredient.value = '';

    ingredientsDiv.appendChild(newIngredient);

    ingredientsDiv.appendChild(addIngredientButton);
}

function addPreparationStep() {
    const preparationDiv = document.querySelector('#preparation');
    const preparationInputs = document.querySelectorAll('#preparation input');

    const newStep = preparationInputs[preparationInputs.length-1].cloneNode(true);

    if(newStep.value == '') return false;

    newStep.value = '';

    preparationDiv.appendChild(newStep);

    preparationDiv.appendChild(addPreparationStepButton);
}

function askForConfirmationToDelete(evt) {
    const confirmation = confirm('Deseja realmente deletar a receita?');

    if(!confirmation) evt.preventDefault();
    console.log('oi')
}

if(addIngredientButton && addPreparationStepButton){
    addIngredientButton.addEventListener('click', addIngredient)
    addPreparationStepButton.addEventListener('click', addPreparationStep)
}

if(deleteForm) deleteForm.addEventListener('submit', askForConfirmationToDelete);