const modalOverlay = document.querySelector('.modal-overlay');
const cards = document.querySelectorAll('.food-card');

const recipeList = [
    {key: "burger",     title: "Triplo bacon burger",           authorName: "Jorge Relato"},
    {key: "pizza",      title: "Pizza 4 estações",              authorName: "Fabiana Melo"},
    {key: "espaguete",  title: "Espaguete ao alho",             authorName: " Júlia Kinoto"},
    {key: "lasanha",    title: "Lasanha mac n’ cheese",         authorName: "Juliano Vieira"},
    {key: "doce",       title: "Docinhos pão-do-céu",           authorName: "Ricardo Golvea"},
    {key: "asinhas",    title: "Asinhas de frango ao barbecue", authorName: "Júlia Kinoto"}
];

function searchObjectInRecipeArray(recipeKey) {
    return recipeList.find(x => x.key === recipeKey);
}

function hideModal() {
    modalOverlay.classList.remove('active');
}

function addListeners() {
    //add event to open modal
    for(let card of cards) {
        card.addEventListener('click', function() {
            modalOverlay.classList.add('active');
            const recipeKey = card.getAttribute('id');
            
            recipeData = searchObjectInRecipeArray(recipeKey);
            
            modalOverlay.querySelector('#recipe-image').src = `/imgs/${recipeData.key}.png`;
            modalOverlay.querySelector('#recipe-title').innerHTML = recipeData.title;
            modalOverlay.querySelector('#recipe-author').innerHTML = `por ${recipeData.authorName}`;
    
        });
    }

    //add event to close modal, only at overlay click
    modalOverlay.addEventListener('click', function() {
        if(event.target === modalOverlay) {
            hideModal();
        }
    })
}

addListeners();