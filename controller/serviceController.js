const axiosInstance = require('../lib/axios.lib.js');

const {
    user: userModel,
    photo: photoModel,
    searchHistory: searchHistoryModel,
    tag: tagModel,
} = require('../models');

// Service Function - Checking if an email already exist in the database.
async function doesUserExist (email) {
    const response = await userModel.findOne({where: {email: email}});
    return response === null;
}

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
            params: { query },
        });

        const results = response.data;
        return res.status(200).json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || "Failed to retrieve the data" });
    }
};

module.exports = { doesUserExist, searchImages };