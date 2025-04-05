const {
    user: userModel,
    photo: photoModel,
    searchHistory: searchHistoryModel,
    tag: tagModel,
    sequelize,
} = require('../models');

const {
    validateNewUser,
    doesUserExist,
    validateNewSavePhoto,
    validateNewTag,
} = require('../validations/index.js');

const createNewUser = async(req, res) => {
    try {
        const newUser = req.body;
        const validationError = validateNewUser(newUser);

        if (validationError) {
            return res.status(400).json({error: validationError});
        }

        if (await doesUserExist(newUser.email)) {
            const response = await userModel.create({
                username: newUser.username,
                email: newUser.email
            });
            return res.status(201).json({message: 'User created successfully', user: response});
        } else {
            return res.status(409).json({error: "Email already exists."});
        }
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Failed to create user."})
    }
}

const savePhoto = async (req, res) => {
    try {
        const saveNewPhoto = req.body;
        const validationError = await validateNewSavePhoto(saveNewPhoto);
        if (validationError) {
            // console.error(validationError);      // Helped in debugging // Was Mistake in aboeve line: const validationError = validateNewSavePhoto(saveNewPhoto); Output: Promise { <pending> } 
            return res.status(400).json({error: validationError});
        } else {
            const response = await photoModel.create({
                imageUrl: saveNewPhoto.imageUrl,
                description: saveNewPhoto.description || null,
                altDescription: saveNewPhoto.altDescription || null,
                userId: saveNewPhoto.userId,
            });
            return res.status(201).json({message: 'Photo saved scuccessfully', photo: response});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: error.message || "Failed to save photo."});
    }
}

const addPhotoTag = async (req, res) => {
    try {
        const { tags } = req.body;
        const photoId = parseInt(req.params.photoId);
        // console.log(photoId);    // Output: 1  // http://localhost:3000/api/photos/1/tags

        const createdTags = [];

        const validationError = await validateNewTag(tags, photoId);
        if (validationError) {
            return res.status(400).json({error: validationError});
        } else {
            for (let tag of tags) {
                const newTag = {
                    name: tag,
                    photoId: photoId,
                };
                const response = await tagModel.create(newTag);
                createdTags.push(response);
            }
        }
        return res.status(201).json({message: 'Tag added successfully', tags: createdTags});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: error.message || "Failed to add tag."});
    }
}

module.exports = { createNewUser, savePhoto, addPhotoTag }