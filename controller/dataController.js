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
    validateSearchPhotosByTagQuery,
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

const searchPhotosByTag = async (req, res) => {
    try {
        const search = req.query.tags;
        const sort = req.query.sort || 'ASC';
        const userId = parseInt(req.query.userId);

        const validationError = await validateSearchPhotosByTagQuery(search, userId, sort);
        if (validationError) {
            return res.status(400).json({error: validationError});
        } else {
            const response = await searchHistoryModel.create({
                query: search,
                userId: userId,
            });
            if (response) {
                const taggedPhotosId = await tagModel.findAll({
                    attributes: ['photoId'],
                    where: {name: search},
                });
                console.log("taggedPhotosId:\n ",taggedPhotosId); 
                /*  ---- Output in Log ----
                    taggedPhotosId:
                    [
                        tag {
                            dataValues: { photoId: 3 },
                            _previousDataValues: { photoId: 3 },
                            uniqno: 1,
                            _changed: Set(0) {},
                            _options: {
                            isNewRecord: false,
                            _schema: null,
                            _schemaDelimiter: '',
                            raw: true,
                            attributes: [Array]
                            },
                            isNewRecord: false
                        }
                    ]
                */
                
                const taggedPhotosWithSearch = await photoModel.findAll({
                    where: {
                        id: taggedPhotosId.map(tag => tag.photoId),
                    },
                    order: [['dateSaved', sort]],
                })
                console.log("taggedPhotosWithSearch:\n ", taggedPhotosWithSearch);
                /* --- Output in Log ----
                    taggedPhotosWithSearch:
                    [
                    photo {
                        dataValues: {
                        id: 3,
                        imageUrl: 'https://images.unsplash.com/photo-1529419412599-7bb870e11810?ixid=M3w3MzA0NTF8MHwxfHNlYXJjaHwzfHxuYXR1cmV8ZW58MHx8fHwxNzQzODM2MDM1fDA&ixlib=rb-4.0.3',
                        description: 'Beautiful landscape',
                        altDescription: 'Mountain view',
                        dateSaved: 2025-04-05T12:10:28.097Z,
                        userId: 1,
                        createdAt: 2025-04-05T12:10:28.098Z,
                        updatedAt: 2025-04-05T12:10:28.098Z
                        },
                        _previousDataValues: {
                        id: 3,
                        imageUrl: 'https://images.unsplash.com/photo-1529419412599-7bb870e11810?ixid=M3w3MzA0NTF8MHwxfHNlYXJjaHwzfHxuYXR1cmV8ZW58MHx8fHwxNzQzODM2MDM1fDA&ixlib=rb-4.0.3',
                        description: 'Beautiful landscape',
                        altDescription: 'Mountain view',
                        dateSaved: 2025-04-05T12:10:28.097Z,
                        userId: 1,
                        createdAt: 2025-04-05T12:10:28.098Z,
                        updatedAt: 2025-04-05T12:10:28.098Z
                        },
                        uniqno: 1,
                        _changed: Set(0) {},
                        _options: {
                        isNewRecord: false,
                        _schema: null,
                        _schemaDelimiter: '',
                        raw: true,
                        attributes: [Array]
                        },
                        isNewRecord: false
                    }
                    ]
                */
               
                return res.status(200).json({message: "Search query successfully fetched photos", photos: taggedPhotosWithSearch});
                /* ---- Output On Screen ----
                    {
                        "message": "Search query successfully fetched photos",
                        "photos": [
                            {
                            "id": 3,
                            "imageUrl": "https://images.unsplash.com/photo-1529419412599-7bb870e11810?ixid=M3w3MzA0NTF8MHwxfHNlYXJjaHwzfHxuYXR1cmV8ZW58MHx8fHwxNzQzODM2MDM1fDA&ixlib=rb-4.0.3",
                            "description": "Beautiful landscape",
                            "altDescription": "Mountain view",
                            "dateSaved": "2025-04-05T12:10:28.097Z",
                            "userId": 1,
                            "createdAt": "2025-04-05T12:10:28.098Z",
                            "updatedAt": "2025-04-05T12:10:28.098Z"
                            }
                        ]
                    }
                */
            }
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({error: error.message || "Failed to create search history log."});
    }
}

module.exports = { createNewUser, savePhoto, addPhotoTag, searchPhotosByTag }