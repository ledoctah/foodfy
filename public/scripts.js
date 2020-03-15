//site pages
const cards = document.querySelectorAll('.food-card');
const hideButtons = document.querySelectorAll('.hide');
const menuItems = document.querySelectorAll('header a');
const currentPage = location.pathname;

function addListeners() {
    //add event to open recipe
    for(let card of cards) {
        const recipeId = card.getAttribute('id');

        card.addEventListener('click', function() {
            window.location.href = `/recipes/${recipeId}`;
        });
    }

    //add event to hide steps
    for(let hideButton of hideButtons) {
        hideButton.addEventListener('click', function() {
            const container = document.querySelector(`#container-${hideButton.getAttribute('id')}`)

            container.classList.toggle('hidden');
            
            if(container.classList.contains('hidden')) {
                hideButton.innerText = 'Mostrar';
            } else {
                hideButton.innerText = 'Esconder';
            }

        })
    }
}

if(cards)
    addListeners();

for(let item of menuItems) {
    if(currentPage.includes(item.getAttribute('href'))) {
        item.classList.add('active');
    }
}

//admin pages
const addIngredientButton = document.querySelector('.add-ingredient');
const addPreparationStepButton = document.querySelector('.add-step');
const deleteForm = document.querySelector('#form-delete');
const chefSelectionBox = document.querySelector('.placeholder');

if(addIngredientButton && addPreparationStepButton) {
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

    addIngredientButton.addEventListener('click', addIngredient)
    addPreparationStepButton.addEventListener('click', addPreparationStep)
}

if(deleteForm) {
    function askForConfirmationToDelete(evt) {
        const confirmation = confirm('Deseja realmente deletar?');
    
        if(!confirmation) evt.preventDefault();
    }

    deleteForm.addEventListener('submit', askForConfirmationToDelete);
}

if(chefSelectionBox) {

    if(chefSelectionBox.dataset.selectedchef.length == 0) {
        chefSelectionBox.addEventListener('change', function(){
            chefSelectionBox.classList.remove('placeholder');
        })
    } else {
        chefSelectionBox.classList.remove('placeholder');
    }

}