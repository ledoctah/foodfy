const cards = document.querySelectorAll('.food-card');
const hideButtons = document.querySelectorAll('.hide');

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

addListeners();