const route = require('express').Router();
const jwt = require('jsonwebtoken');
const sha = require('sha1')
const adminModel = require('../model/AdminSchema')
const userModel = require('../model/UserSchema')
const notificationModel = require('../model/NotificationSchema')
const key = require('../config/token_Keys');
const admin = require("firebase-admin");
require('dotenv').config();  // Load environment variables from .env


const serviceAccount = {
    "type": "service_account",
    "project_id": "typing-test-57f38",
    "private_key_id": "8bbf09d18a4ec9e88243bc8c8404e23ddae660be",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCoDzH4XU/SCWUh\nDyHQHr+cIGsyKUjCoEv2Q6f8ubjWmhd4Yb9NuSWWiNuInI4vPyYN6Nru+CvHZ3D/\nDep4MOxcQ2jD/zlcRfkV+P/BiXWBzyUHg3rJ6sgk5YYQ/rTNb3jawJoIDTtjbe+7\n0OnyB+HtQciaZX5+ztvxfUa2awPEpqDy7mYOpBvB+d/fnxrk2XzX6dM7qhD6sa4q\n6wNLnTML5cEX4DPjnCXcIEPG5qvO469d3WwsqpZ8GI1sWINW/5CahObMcmW8q047\nfCGpeLSvnxpC43LFbLcPbZ2cgshjT8tCM9bjaGER0UX4WcfNyTK5LCE7xBuhbnll\nfJHoHHRrAgMBAAECggEALMf3wb1jgo0cVGXK1cELv5dn2PLlP28lLpaykYYPeaeP\nr3UkW5qFKIqJLOrCfFZwVm6AwAKC79xhYKUdoC8xHBieNvOwHiVLDQ7PX4u4MwG2\nVT00n88ey64ZPjgQh1k3s9p0cMbN11247qvpWqO9ENJhmLqIrVODieKe0AbN9z0b\nwW9JxJ2tHALhs/ix+JAKahPGsWYImSH7FgNNnpIgTbzJLGazOEtydaXYsWeZpa/s\njhaTylM3Ej//Ndklyv81LYhekHdfjhocdkp5V+V3LJCQZWaVIdB7xLNuZYg4s0pD\nfPWpeCcxS+wXFTPUi6pywyiCNrDDSJFIa72R9zafSQKBgQDthlKMSAet4cuAHVtv\n6K0gQnYvPH+IZOKXleMSITmxqP3/CgUaGgbuiNuuIPcwHxj0pKNWL4tIZCXIiRkJ\n0UEZqIgdvkTm7OT2+HAkG3k0NKWRl2jpZWNX+nFu3K13FUERJoiUo/OA3+JA8s9T\nUi467AoUIjHCDe7tVYFivyrkJQKBgQC1IadewRAvZrZNPveorgIgtl/TAeWW8voF\n2w3XMNA1O139HWHXpL+OeZkizSzCZnTV33UE5aq586o2T57xa8CpN3r896HZF8mW\nRwkBWJiXN4eor9U2f7E3A8HWC3tzeAdEvYXmYQvr3MVE45rvoW1XVCxHMV1P3d9g\neqxzthPJTwKBgQCKdzyWFMONRUz5waN1SKHsZXI6NT1viMhjb/hwsDfO7uIrFG9G\n+RdDZTsTdppDTk2hCH1Dl/HNYLx5/BpBk+AskgfPtwS5zi3oH4pYMj/lBC/lAOwi\n630PY6tO4oypGBXXZqxGYpFodpuSGzprq0PSC5oQhKKXKsI3TxpfM2xQlQKBgQCA\njBzLS3sgGOYCVlDPPoc2DhhdmTgGc/RrGXZuJS9ux+5BR4v7zelAxR2gLDq60JnU\ne10CF7iddcdz+ffUYGN/9GbthxUvDAm+BDXo5aaNkxRM7FUF84OihqEXNljrruCB\nsXuI75DVWH4MEPgRXuBJnOw7rlYJ622vfABNsofCUwKBgH7zlu5giGD+AAJdMGbr\n54dbs4atB5/jmue/jHE7gFXWJDagqyLeQy1IAVeThKZ8RV9VOjBqqfT80ipg0B7y\nHuRHghHrG20/roNGI/t6OSPiQ0fbhkY8bRZ/ywdT05mV39hB9+AJW/jDRCdIbR6a\nKfbewWEBAcAgvV9nJ35/Mq0V\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-owp3i@typing-test-57f38.iam.gserviceaccount.com",
    "client_id": "110011254614305091777",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-owp3i%40typing-test-57f38.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }
// const serviceAccount = {
//     type: 'service_account',
//     project_id: process.env.FIREBASE_PROJECT_ID,
//     private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
//     private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Correctly replace escaped \n
//     client_email: process.env.FIREBASE_CLIENT_EMAIL,
//     client_id: process.env.FIREBASE_CLIENT_ID,
//     auth_uri: 'https://accounts.google.com/o/oauth2/auth',
//     token_uri: 'https://oauth2.googleapis.com/token',
//     auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
//     client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
// };


    // Check if already initialized to prevent re-initialization issues
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } else {
        console.log('Firebase already initialized');
    }



route.use('/blog', require('./sub-controllers/BlogController'))
route.use('/users', require('./sub-controllers/UsersController'))


route.get('/', async(req, res) => {
    // console.log(req.headers.authorization)
    if(req.headers.authorization){
        let ID = jwt.decode(req.headers.authorization, key)
        let adminData = await adminModel.findOne({_id : ID?.id})
        let userCount = await userModel.countDocuments({})
        adminData = {
            email : adminData?.email,
            username : adminData?.username,
            paragraphs : adminData?.paragraphs,
            blogCount : adminData?.blog?.length,
            block : adminData?.blockUser,
            userCount : userCount,
            blogCategory : adminData?.blogCategory
        }
        if(adminData) {
            res.send({ status : 200, adminData : adminData })
        }else{
            res.send({status : 403})
        }
    }
});

route.post('/signin', async(req, res) => {
    const { signin, password, type } = req.body;
    // return
    let isUserExist;
    if(type === 'username') {
        isUserExist = await adminModel.findOne({ username : signin }) 
    } else {
        isUserExist = await adminModel.findOne({ email : signin }) 
    }
    if(isUserExist) {
        if(sha(password) === isUserExist?.password) {
            const ID = {id : isUserExist?._id};
            const token = jwt.sign(ID, key)
            res.send({ status : 200, token : token, message : "Logged in Successfully", type : 'signin' })
        } else res.send({ status : 402, message : "Password is Incorrect", type : 'signin' })
    } else res.send({ status : 401, message : "Email ID is Invalid", type : 'signin' })
});

route.post('/add-para', async (req, res) => {
    if (req.headers.authorization) {
        const ID = jwt.decode(req.headers.authorization, key);
        const { paragraphs, level, time } = req.body;

        const isThisAdmin = await adminModel.findOne({ _id: ID?.id });
        if (!isThisAdmin) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Map time to the correct nested field
        const changeTime = {
            '1': 'Min1',
            '3': 'Min3',
            '5': 'Min5',
        };
        const timeField = changeTime[time];
        if (!timeField) {
            return res.status(400).json({ message: "Invalid time parameter" });
        }

        // Define the dynamic path in paragraphs
        const arrayFieldPath = `paragraphs.${timeField}.${level}`;

        // Convert each paragraph to the format { id, para }
        const formattedParagraphs = paragraphs.map((paraObj) => ({
            id: paraObj.id || uuidv4(), // Generate a unique ID only if it doesn't exist
            para: paraObj.para,
        }));

        try {
            // Fetch existing paragraphs to check for duplicates
            const existingData = await adminModel.findOne({ _id: ID?.id });
            const existingParagraphs = existingData?.paragraphs[timeField]?.[level] || [];

            // Create a map of existing paragraphs by ID for quick lookup
            const existingMap = new Map(existingParagraphs.map(para => [para.id, para]));

            // Prepare updates and new paragraphs to push
            const updates = [];
            const paragraphsToPush = [];

            // Check each formatted paragraph
            for (const newPara of formattedParagraphs) {
                if (existingMap.has(newPara.id)) {
                    // Prepare to overwrite the existing paragraph if it exists
                    updates.push({
                        updateOne: {
                            filter: { _id: ID?.id, [`${arrayFieldPath}.id`]: newPara.id },
                            update: { $set: { [`${arrayFieldPath}.$.para`]: newPara.para } } // Update the existing paragraph
                        }
                    });
                } else {
                    // If the paragraph ID does not exist, add to the push array
                    paragraphsToPush.push(newPara);
                }
            }

            // Perform bulk updates for existing paragraphs
            if (updates.length > 0) {
                await adminModel.bulkWrite(updates);
            }

            // Push new paragraphs if any exist
            if (paragraphsToPush.length > 0) {
                await adminModel.updateOne(
                    { _id: ID?.id },
                    { $push: { [arrayFieldPath]: { $each: paragraphsToPush } } } // Push each new paragraph object
                );
            }

            const paraData = await adminModel.findOne({ _id: ID?.id });
            res.send({ status: 200, message: "Paragraphs added successfully", type: 'addpara', paragraphs: paraData?.paragraphs });
        } catch (error) {
            console.error("Error updating paragraphs:", error);
            res.status(500).json({ message: "An error occurred while adding paragraphs" });
        }
    } else {
        res.status(401).json({ message: "Authorization header missing" });
    }
});

route.post('/para', async (req, res) => {
    if(req.headers.authorization) {}
    const ID = jwt.decode(req.headers.authorization, key);
    const { id, time, level } = req.body;
    const isThisAdmin = await adminModel.findOne({ _id: ID?.id });

    if (isThisAdmin) {
        // Map `time` to the correct nested field
        const changeTime = {
            '1': 'Min1',
            '3': 'Min3',
            '5': 'Min5',
        };
        const timeField = changeTime[time];

        if (!timeField) {
            return res.status(400).json({ message: "Invalid time parameter" });
        }

        // Define the dynamic path in `paragraphs`
        const arrayFieldPath = `paragraphs.${timeField}.${level}`;

        // Use $pull to remove the object that matches the id from the array
        const result = await adminModel.updateOne(
            { _id: ID?.id },
            { $pull: { [arrayFieldPath]: { id: id } } } // Match by id
        );

        if (result.modifiedCount > 0) {
            return res.send({status : 200, message: "Paragraph deleted successfully", type : 'deletepara'});
        } else {
            return res.status(404).json({ message: "Paragraph not found" });
        }
    } else {
        return res.status(403).json({ message: "Unauthorized access" });
    }
});

// Route to send notification to all users
route.post("/send-notification", async (req, res) => {
    const { title, message } = req.body;
    
    try {
        const users = await notificationModel.find({ fcmToken: { $exists: true, $ne: null } });
        const tokens = users.map((user) => user.fcmToken);
    
        const payload = {
            notification: {
                title,
                body: message
            }
        };

        // Send notifications to each device
        const response = await admin.messaging().sendEachForMulticast({
            tokens: tokens,
            notification: payload.notification,
        });

        // Check for individual failed tokens
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
            if (!resp.success) {
                failedTokens.push(tokens[idx]);
                console.error("Error sending to token:", tokens[idx], resp.error);
            }
        });

        res.status(200).json({ 
            success: true,
            message: "Notification processed with possible individual failures.",
            failedTokens: failedTokens,
            successCount: response.successCount,
            failureCount: response.failureCount
        });

    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});










module.exports = route;