//site pages
const cards = document.querySelectorAll('.food-card');
const hideButtons = document.querySelectorAll('.hide');
const menuItems = document.querySelectorAll('header a');
const currentPath = location.pathname;

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
    if(currentPath.includes(item.getAttribute('href'))) {
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

function paginate(totalPages, selectedPage) {
    let pages = [],
        oldPage;

    for(let currentPage = 1; currentPage <= totalPages; currentPage++) {
        
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
        const pagesAfterSelectedPage = currentPage <= selectedPage + 1;
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 1;

        if(firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {

            if(oldPage && currentPage - oldPage > 2) {
                pages.push('...');
            }

            if(oldPage && currentPage - oldPage == 2){
                pages.push(oldPage + 1);
            }

            pages.push(currentPage);

            oldPage = currentPage;
        }
    }

    return pages;
}

function createPagination() {
    const filter = pagination.dataset.filter;
    const totalPages = +pagination.dataset.total;
    const selectedPage = +pagination.dataset.page;
    const pages = paginate(totalPages, selectedPage);

    let elements = "";

    for(let page of pages) {
        if(String(page).includes('...')) {
            elements += `<span>...</span>`;
        } else {
            if(!filter){
                elements += `<a href="?page=${page}" ${(selectedPage == page ? 'class="active"' : '')}>${page}</a>`;
            }else{
                elements += `<a href="?filter=${filter}&page=${page}" ${(selectedPage == page ? 'class="active"' : '')}>${page}</a>`;
            }
        }
    }

    pagination.innerHTML = elements;
}

const pagination = document.querySelector('.pagination');

if(pagination) {
    createPagination();
}