const {
    user: userModel,
    photo: photoModel,
    searchHistory: searchHistoryModel,
    tag: tagModel,
} = require('../models');

function validateNewUser(newUser) {
    if (!newUser.username || !newUser.email) {
        return 'Username and Email is required to create new user';
    } else if (!newUser.email.includes('@') || !newUser.email.includes('.')) {
        return "Invalid Email Provided, It should include '@' or '.'";
    }
    return null;    
}

async function doesUserExist (email) {
    const response = await userModel.findOne({where: {email: email}});
    return response === null;
}

async function validateNewSavePhoto (newSavePhoto) {
    // checking for valid imageUrl
    if (!newSavePhoto.imageUrl) {
        return 'Image URL is required to save a photo';
    } else if (!newSavePhoto.imageUrl.startsWith('https://images.unsplash.com/')) {
        return "Invalid Image URL Provided, It should start with 'https://images.unsplash.com/'";
    }
    
    // Checking for valid userId
    if (!newSavePhoto.userId) {
        return 'User ID is required to save a photo';
    }
    else if (!Number.isInteger(newSavePhoto.userId)) {
        return 'User ID should be an integer';
    }
    else if (await userModel.findByPk(newSavePhoto.userId) === null) {
        return "User does not exist";
    }

    return null;
}

module.exports = { validateNewUser, doesUserExist, validateNewSavePhoto }