const axiosInstance = require('../lib/axios.lib.js');

const {
    user: userModel,
    photo: photoModel,
    searchHistory: searchHistoryModel,
    tag: tagModel,
} = require('../models');

const { validateUserId } = require('../validations/index.js');

let latestSearchImages = [];

const searchImages = async (req, res) => {
    try {
        const query = req.query.query; // Extract the 'query' parameter as a string
        if (!query) {
            return res.status(400).json({ error: "Search query is required." });
        }

        const accessKey = process.env.CLIENT_KEY;
        if (!accessKey) {
            throw new Error('Unsplash API key is missing. Please configure your .env file.');
        }

        const response = await axiosInstance.get(`/search/photos`, {
            params: { query, 
                client_id: accessKey,
             },
        });

        const results = response.data;
        latestSearchImages = results.results.map((image) =>  {
            return {
                imageUrl: image.urls.raw,
                description: image.description || null,
                altDescription:  image.alt_description || null,
            }
        })
        return res.status(200).json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || "Failed to retrieve the data" });
    }
};

const viewSearchHistory = async (req, res) => {
    try {
        const userId = parseInt(req.query.userId);
        const validationError = await validateUserId(userId);
        if (validationError) {
            return res.status(400).json({error: validationError});
        } else {
            const searchHistory = await searchHistoryModel.findAll({
                attributes: ['query', 'timestamp'],
                where: { userId: userId },
                order: [['timestamp', 'DESC']],
                limit: 25,
            })
            return res.status(200).json({message: "Search history retrived successfully", searchHistory: searchHistory});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: error.message || "Failed to retrieve search history."})
    }
}

module.exports = { searchImages, viewSearchHistory, latestSearchImages };