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

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photo-preview'),
    uploadLimit: 0,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target;
        this.input = event.target;
        this.uploadLimit = this.input.dataset.limit;

        if(this.hasLimit(event)) return;

        Array.from(fileList).forEach(file => {
            this.files.push(file);

            const reader = new FileReader();

            reader.onload = () => {
                const image = new Image();
                image.src = String(reader.result);

                const div = this.getContainer(image);

                this.preview.appendChild(div);
            }

            reader.readAsDataURL(file);
        });

        this.input.files = this.getAllFiles();
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = this;
        const { files: fileList } = input;

        if(fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`);
            event.preventDefault();
            return true;
        }

        const photosDiv = [];
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value == "photo") {
                photosDiv.push(item);
            }
        });

        const totalPhotos = fileList.length + photosDiv.length;

        if(totalPhotos > uploadLimit) {
            alert(`Você atingiu o limite máximo de fotos`);
            event.preventDefault();

            return true;
        }

        return false;
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer();

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file));

        return dataTransfer.files;
    },
    getContainer(image) {
        const div = document.createElement('div');
        div.classList.add('photo');

        div.onclick = this.removePhoto;

        div.appendChild(image);

        div.appendChild(this.getRemoveButton());

        return div;
    },
    getRemoveButton() {
        const button = document.createElement('i');

        button.classList.add('material-icons');
        button.innerHTML = 'close';

        return button;
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode; // <div class="photo">
        const photosArray = Array.from(PhotosUpload.preview.children);
        const index = photosArray.indexOf(photoDiv) - 1;
        
        PhotosUpload.files.splice(index, 1);

        PhotosUpload.input.files = PhotosUpload.getAllFiles();

        photoDiv.remove(index);
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode;
        
        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]');
            if(removedFiles){
                removedFiles.value += `${photoDiv.id},`;
            }
        }

        photoDiv.remove();
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e;

        this.previews.forEach(preview => preview.classList.remove('active'));

        target.classList.add('active');

        this.highlight.src = target.src;
        Lightbox.image.src = target.src;
    },
}