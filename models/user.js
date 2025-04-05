// const { DataTypes } = require("sequelize");
// const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
        username: DataTypes.STRING,
        email: DataTypes.STRING,
    });
    return user;
}

/* ---- GitHub CoPilot ----
Question: why sequelize directly passed as argument to the model function.
Answer: The system knows that index.js is the centralized file for all the models because of how Sequelize is designed and how the file is structured. Specifically, the Sequelize CLI and the developer's codebase rely on conventions and configurations to treat index.js as the entry point for managing models.
    Here’s how it works:
        1. Sequelize CLI Convention
            The Sequelize CLI expects a specific folder structure and file naming convention. By default:
                * The models folder contains all the model definitions.
                * The index.js file is the entry point for initializing and exporting all models.
            When you run Sequelize commands (e.g., npx sequelize-cli db:migrate), the CLI uses index.js to load and initialize all models.
*/