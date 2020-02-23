const cards = document.querySelectorAll('.food-card');

function addListeners() {
    //add event to open modal
    for(let card of cards) {
        const recipeId = card.getAttribute('id');

        card.addEventListener('click', function() {
            window.location.href = `/recipes/${recipeId}`;
        });
    }
}

addListeners();