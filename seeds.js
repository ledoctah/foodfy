const faker = require('faker/locale/pt_BR');
const fs = require('fs');
const path = require('path');

const { hash } = require('bcryptjs');
const { fake } = require('faker/locale/pt_BR');
const { crypto } = require('crypto');

const User = require('./src/app/models/User');
const Recipe = require('./src/app/models/Recipe');
const Chef = require('./src/app/models/Chef');
const File = require('./src/app/models/File');
const RecipeFile = require('./src/app/models/RecipeFile');

const password = '123';

const usersIds = [];
const recipesIds = [];
const chefsIds = [];
const recipeFilesId = [];

const totalChefs = 5;
const totalRecipes = 10;
const totalUsers = 3;

async function createAdmin() {
    const id = await User.create({
        name: 'Foodfy admin',
        email: 'admin@foodfy.com',
        password: await hash(password, 8),
        is_admin: true
    });

    usersIds.push(id);
}

async function createUsers() {
    const users = [];

    while(users.length < totalUsers) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: await hash(password, 8),
            is_admin: false
        });
    }

    const usersPromise = users.map(user => User.create(user));
    
    usersIds.push(
        ...await Promise.all(usersPromise)
    );
}

async function createChefs() {
    const chefs = [];

    while(chefs.length < totalChefs) {
        const filename = `placeholder.png`;
        const timestamp = Date.now().toString();
        const filePath = `public\\images\\${timestamp}_${filename}`;

        fs.copyFileSync(
            path.resolve(__dirname, './public/resources/placeholder.png'), 
            path.resolve(__dirname, `./${filePath}`)
        );
        
        const file_id = await File.create({
            filename,
            path: filePath
        });

        chefs.push({
            name: faker.name.firstName(),
            file_id
        });
    }

    const chefsPromise = chefs.map(chef => Chef.create(chef));

    chefsIds.push(
        ...await Promise.all(chefsPromise)
    );
}

async function createRecipes() {
    const recipes = [];

    while(recipes.length < totalRecipes) {
        const filename = `placeholder.png`;
        const timestamp = Date.now().toString();
        const filePath = `public\\images\\${timestamp}_${filename}`;

        fs.copyFileSync(
            path.resolve(__dirname, './public/resources/placeholder.png'), 
            path.resolve(__dirname, `.\\${filePath}`)
        );

        const file_id = await File.create({
            filename,
            path: filePath
        });

        recipeFilesId.push(file_id);

        recipes.push({
            chef_id: chefsIds[Math.floor(Math.random() * totalChefs)],
            title: faker.name.title(),
            ingredients: [faker.lorem.word(8), faker.lorem.word(10), faker.lorem.word(12)],
            preparation: [faker.lorem.words(4), faker.lorem.words(3), faker.lorem.words(7)],
            information: faker.lorem.paragraph(8),
            user_id: usersIds[Math.floor(Math.random() * totalUsers)]
        });
    }

    const recipesPromise = recipes.map(recipe => Recipe.create(recipe));

    recipesIds.push(
        ...await Promise.all(recipesPromise)
    );
}

async function createRecipeFiles() {
    const recipeFiles = [];

    for(c in recipesIds) {
        const recipe_id = recipesIds[c];
        const file_id = recipeFilesId[c];

        recipeFiles.push({
            recipe_id,
            file_id
        });
    }

    const recipesFilesPromise = recipeFiles.map(recipeFile => RecipeFile.create(recipeFile));

    await Promise.all(recipesFilesPromise);
}

const init = async () => {
    await createAdmin();
    await createUsers();
    await createChefs();
    await createRecipes();
    await createRecipeFiles();
}

init();