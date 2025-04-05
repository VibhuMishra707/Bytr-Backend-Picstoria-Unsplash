const sequelize = require('sequelize');

const {
    user: userModel,
    photo: photoModel,
    searchHistory: searchHistoryModel,
    tag: tagModel,
} = require('../models');

function validateNewUser(newUser) {
    if (!newUser.username || !newUser.email) {
        return "Username and Email is required to create new user";
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
        return "Image URL is required to save a photo";
    } else if (!newSavePhoto.imageUrl.startsWith('https://images.unsplash.com/')) {
        return "Invalid Image URL Provided, It should start with 'https://images.unsplash.com/'";
    }
    
    // Checking for valid userId
    if (!newSavePhoto.userId) {
        return "User ID is required to save a photo";
    }
    else if (!Number.isInteger(newSavePhoto.userId)) {
        return "User ID should be an integer";
    }
    else if (await userModel.findByPk(newSavePhoto.userId) === null) {
        return "User does not exist";
    }

    return null;
}

async function validateTagsCount (tags, photoId) {
    const tagsCurrentCount = await tagModel.findAll({
        attribute: [ 
            'id', 
            [sequelize.fn('COUNT', sequelize.col('id')), 'count'], 
        ],
        where: {photoId: photoId},
    });
    if (tagsCurrentCount + tags.length >= 5) {
        if (tagsCurrentCount === 0) {
            return "Maximum 5 tags are allowed per photo";
        } else {
            return `Maximum 5 tags are allowed per photo, ${5 - tagsCurrentCount} tags left`;
        }
    }
    return null;
}

async function validateTagIsUnique (tags, photoId) {
    const existingTags = await tagModel.findAll({
        attributes: ['name'],
        where: { photoId: photoId },
    });
    const existingTagNames = existingTags.map(tag => tag.name);
    const duplicateTags = tags.filter(tag => existingTagNames.includes(tag));
    if (duplicateTags.length > 0) {
        return `Duplicate tags found: ${duplicateTags.join(', ')}`;
    }
}

async function validateNewTag (tags, photoId) {
    // validate tags Array
    if (!Array.isArray(tags) || tags.length === 0) {
        return res.status(400).json({error: "Tags should be an array and cannot be empty."});
    }

    // validate the photoId
    if (!photoId) {
        return "Photo ID is required to add tags";
    } else if (!Number.isInteger(photoId)) {
        return "Photo ID should be an integer";
    } else if (await photoModel.findByPk(photoId) === null) {
        return "Photo does not exist";
    }

    // Validate the Count of Tags
    const validateTagsCountError = await validateTagsCount(tags, photoId);
    if (validateTagsCountError) {
        return validateTagsCountError;
    }

    // Validate the uniqueness of tags based on photoId
    const validateTagIsUniqueError = await validateTagIsUnique(tags, photoId);
    if (validateTagIsUniqueError) {
        return validateTagIsUniqueError;
    }

    // Validate the tag names
    function validateTagName(tag) {
        if (typeof tag !== 'string' || tag.trim().length === 0) {
            return "Tags must be non-empty strings";
        }
        return null;
    }

    const invalidTags = tags.map(validateTagName).filter(tag => tag !== null);
    if (invalidTags.length > 0) {
        return `Invalid tags: ${invalidTags.join(', ')}`;
    }
    
    return null;
}

module.exports = { validateNewUser, doesUserExist, validateNewSavePhoto, validateNewTag }