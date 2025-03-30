const {
    user: userModel,
    photo: photoModel,
    searchHistory: searchHistoryModel,
    tag: tagModel,
} = require('../models');

const {
    doesUserExist
} = require('./serviceController.js')

const {
    validateNewUser
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


module.exports = { createNewUser }