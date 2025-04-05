const {
    user: userModel,
    photo: photoModel,
    searchHistory: searchHistoryModel,
    tag: tagModel,
} = require('../models');

const {
    validateNewUser,
    doesUserExist,
    validateNewSavePhoto
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
            // console.error(validationError);      // Helped in debugging // Output: Promise { <pending> }
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

module.exports = { createNewUser, savePhoto }