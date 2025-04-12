const request = require('supertest');
const http = require('http');

const axiosInstance = require('../lib/axios.lib.js');
const { sequelize } = require('../models/index.js');

jest.mock('../lib/axios.lib.js', () => ({
    get: jest.fn(),
    post: jest.fn(),
}));

const { app } = require("../index.js");

const {
    createNewUser, 
    savePhoto, 
    addPhotoTag, 
    searchPhotosByTag } = require('../controller/dataController.js');

const { 
    searchImages, 
    viewSearchHistory } = require('../controller/serviceController.js');

jest.mock('../controller/dataController.js', () => ({
    ...jest.requireActual('../controller/dataController.js'),
    createNewUser: jest.fn(),
    savePhoto: jest.fn(),
    addPhotoTag: jest.fn(),
    searchPhotosByTag: jest.fn(),
}));

jest.mock('../controller/serviceController.js', () => ({
    searchImages: jest.fn(),
    viewSearchHistory: jest.fn(),
}));

let server;

beforeAll(async () => {
    server = http.createServer(app);
    server.listen(3001, () => {
        console.log('Test server runnning on port 3001');
    });
});

afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    console.log('Test server closed');
});

/* ---- GPT 4o (GitHub CoPilot) ----
In an async function, you can use await to handle asynchronous operations, and Jest will automatically wait for the async function to resolve. 
Using done in an async function is redundant and can lead to confusion or errors if done is called prematurely.
*/

/* ---- GPT 4o (GitHub CoPilot) ----
A `Promise` in JavaScript is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. It allows you to write asynchronous code in a more readable and manageable way, avoiding deeply nested callbacks (commonly referred to as "callback hell").

Key Features of a Promise:
States:
    Pending: The initial state, neither fulfilled nor rejected.
    Fulfilled: The operation completed successfully, and the promise has a resulting value.
    Rejected: The operation failed, and the promise has a reason for the failure (usually an error).
Methods:
    `then()`: Used to handle the resolved value of a promise.
    `catch()`: Used to handle errors or rejected promises.
    `finally()`: Executes a callback once the promise is settled (fulfilled or rejected), regardless of the outcome.

Example:
        const myPromise = new Promise((resolve, reject) => {
        const success = true; // Simulate success or failure
        if (success) {
            resolve("Operation successful!");
        } else {
            reject("Operation failed!");
        }
    });

    myPromise
        .then((result) => {
            console.log(result); // Logs: "Operation successful!"
        })
        .catch((error) => {
            console.error(error); // Logs: "Operation failed!" if rejected
        })
        .finally(() => {
            console.log("Promise settled."); // Always runs
        });

Why Use Promises?
    Improved Readability: Promises make asynchronous code easier to read and maintain.
    Chaining: You can chain multiple asynchronous operations using `.then()`.
    Error Handling: Centralized error handling with `.catch()`.
    Promises are a core part of modern JavaScript and are often used with `async/await` for even cleaner syntax.
*/

// describe("dataController tests", () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });

//         it("POST /api/users - should create a new user", async () => {
//         const now = new Date().toISOString();

//         const mockResponse = {
//             "message": "User created successfully",
//             "user": {
//                 "id": 2,
//                 "username": "mockUser",
//                 "email": "mockUser@example.com",
//                 "updatedAt": now,
//                 "createdAt": now
//             }
//         };

//         axiosInstance.post.mockResolvedValue(mockResponse);

//         req = {
//             body: {
//                 "username": "newUser_2",
//                 "email": "newuser_2@example.com"
//             }
//         };
//         res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//         };

        
//         await createNewUser(req, res);
//         expect(axiosInstance.post).toHaveBeenCalledWith('/api/users', req.body);
//         expect(res.status).toHaveBeenCalledWith(201);
//         expect(res.json).toHaveBeenCalledWith(mockResponse);
//     });
// });
// Reference: itineraryController.js | Section - 2 > Chapter 4 - MS1 - Working with Mciroservices > Tutorials > MS1.6 > trip_planner_backend

describe("Function Testing", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("createNewUser - should create a new user", async () => {
        const mockUser = {
            "username": "mockUser",
            "email": "mockUser@example.com"
        };

        const now = new Date().toISOString();

        const mockResponse = {
            "message": "User created successfully",
            "user": {
                "id": 2,
                "username": "mockUser",
                "email": "mockUser@example.com",
                "updatedAt": now,
                "createdAt": now
            }
        };

        createNewUser.mockResolvedValue(mockResponse); // Mock the resolved value

        const result = await createNewUser({ body: mockUser });
        expect(createNewUser).toHaveBeenCalled();
        expect(createNewUser).toHaveBeenCalledTimes(1);
        expect(createNewUser).toHaveBeenCalledWith({ body: mockUser });
        expect(result).toEqual(mockResponse);
    });

    it("savePhoto - should save a new photo new collection", async () => {
        const mockPhoto = {
                    "imageUrl": "https://images.unsplash.com/photo-1529419412599-7bb870e11810?ixid=M3w3MzA0NTF8MHwxfHNlYXJjaHwzfHxuYXR1cmV8ZW58MHx8fHwxNzQzODM2MDM1fDA&ixlib=rb-4.0.3",
                    "description": "Beautiful landscape",
                    "altDescription": "Mountain view",
                    "userId": 1
                }
        
        const now = new Date().toISOString();

       const mockResponse = {
            "message": "Photo saved scuccessfully",
            "photo": {
                "dateSaved": "2025-04-12T13:53:34.302Z",
                "id": 4,
                "imageUrl": "https://images.unsplash.com/photo-1529419412599-7bb870e11810?ixid=M3w3MzA0NTF8MHwxfHNlYXJjaHwzfHxuYXR1cmV8ZW58MHx8fHwxNzQzODM2MDM1fDA&ixlib=rb-4.0.3",
                "description": "Beautiful landscape",
                "altDescription": "Mountain view",
                "userId": 1,
                "updatedAt": "2025-04-12T13:53:34.303Z",
                "createdAt": "2025-04-12T13:53:34.303Z"
            }
        }

        savePhoto.mockResolvedValue(mockResponse);
        const result = await savePhoto({ body: mockPhoto });
        expect(savePhoto).toHaveBeenCalled();
        expect(savePhoto).toHaveBeenCalledTimes(1);
        expect(savePhoto).toHaveBeenCalledWith({ body: mockPhoto });
        expect(result).toEqual(mockResponse);
    });

    it("addPhotoTag - should add tags to a photo", async () => {
        const mockTags = {
            "tags": ["mockTag1", "mockTag2"]
          }
        const photoId = 1;  // Watchout: MockResponse photoId is 3
        
        const now = new Date().toISOString();
        const mockResponse = {
            "message": "Tag added successfully",
            "tags": [
                {
                    "id": 6,
                    "name": "mockTag1",
                    "photoId": 3,
                    "updatedAt": now,
                    "createdAt": now
                },
                {
                    "id": 7,
                    "name": "mockTag2",
                    "photoId": 3,
                    "updatedAt": now,
                    "createdAt": now
                }
            ]
        };

        addPhotoTag.mockResolvedValue(mockResponse);
        const result = await addPhotoTag({ body: mockTags, params: { photoId } });
        expect(addPhotoTag).toHaveBeenCalled();
        expect(addPhotoTag).toHaveBeenCalledTimes(1);
        expect(addPhotoTag).toHaveBeenCalledWith({ body: mockTags, params: { photoId } });
        expect(result).toEqual(mockResponse);
    });

});