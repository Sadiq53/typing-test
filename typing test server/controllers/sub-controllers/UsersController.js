const route = require('express').Router();
const jwt = require('jsonwebtoken');
const sha = require('sha1')
const adminModel = require('../../model/AdminSchema')
const userModel = require('../../model/UserSchema')
const notificationModel = require('../../model/NotificationSchema')
const key = require('../../config/token_Keys');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique IDs
const randNum = require('random-number')
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config(); 
const { S3Client, PutObjectCommand, DeleteObjectCommand  } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');

// Initialize AWS S3 client using v3 SDK
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
  
  // Multer S3 storage configuration
    const storage = multerS3({
        s3: s3Client,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const newFilename = `profile/${uniqueSuffix}${extension}`;
        cb(null, newFilename); // S3 key (path within the bucket)
        }
    });
  
    const upload = multer({ storage: storage });

    // Function to delete an existing image from S3
  const deleteImageFromS3 = async (imageKey) => {
    try {
      const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
      };
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await s3Client.send(deleteCommand); // Using the v3 SDK method
      console.log("Existing profile image deleted from S3 successfully.");
    } catch (error) {
      console.error("Error deleting image from S3:", error);
    }
  };

route.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = 50; // Number of users per page
    const skip = (page - 1) * limit;

    try {
        // Get the total count of users
        const totalUsers = await userModel.countDocuments();

        // Fetch the users for the current page
        const paginatedUsers = await userModel
            .find({})
            .skip(skip)
            .limit(limit);

            const filteredData = paginatedUsers?.map(value => {
                return {
                    username : value?.username,
                    profile : value?.profileimage?.s3url,
                    isblock : value?.isblocked?.status,
                    createdate : value?.createdate,
                    accountid : value?.accountid
                }
            })

        res.status(200).json({
            status: 200,
            data: filteredData,
            totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ status: 500, message: 'Internal server error' });
    }
});

route.post('/add', async(req, res) => {
    if(req.headers.authorization){
        let ID = jwt.decode(req.params.id, key)
        const isThisAdmin = await adminModel.findOne({_id : ID?.id})
        const { email, username, password, createdate } = req.body;

        const checkUserName = await userModel.findOne({ username : username })
        if(!checkUserName) {
            const checkEmail = await userModel.findOne({ email : email })
            if(!checkEmail) {
                const accountID = randNum.generator({ min : 100000, max : 9999999, integer : true });
                const finalData = {
                    username : username,
                    email : email,
                    password : sha(password),
                    createdate : createdate,
                    accountid : accountID(),
                    authType : {google : false, email : true}
                }
                await userModel.create(finalData)
                const getUser = await userModel.findOne({ email : email })
                await notificationModel.create({userId : getUser?._id, fcmToken : ''})
                res.send({ status : 200, message : "Account Created Successfully", type : 'signup', userData : getUser })
            } else res.send({ status : 402, message : "Email ID Exist", type : 'signup' }) 
        } else res.send({ status : 402, message : "username exist", type : 'signup' })
    }
})

route.post('/block-unblock/:id', async(req, res) => {
    let ID = jwt.decode(req.params.id, key)
    const {username, date} = req.body
    const isThisAdmin = await adminModel.findOne({_id : ID?.id})
    if(isThisAdmin) {
        const user = await userModel.findOne({username : username})
        if(user) {
            const newBlockData = {
                status : !user?.isblocked?.status,
                date : date
            }
            await userModel.updateOne({username : username}, {$set : {isblocked : newBlockData}})
             // Update the admin's blockUser array
            const checBlockedState = newBlockData?.status; 
            if (checBlockedState) {
                await adminModel.updateOne(
                    { _id: ID?.id },
                    { $push: { blockUser: { accountid: user?.accountid } } } // Push an object with accountid
                );
            } else {
                await adminModel.updateOne(
                    { _id: ID?.id },
                    { $pull: { blockUser: { accountid: user?.accountid } } } // Pull the object matching accountid
                );
            }            
            res.send({status : 200, message : "Block Unblock User", type : "block-unblock"})
        }

    }

})

route.post('/updatepass', async(req, res) => {
    if(req.headers.authorization){
        const { username, newpassword } = req.body;
        const findUser = await userModel.findOne({ username : username })
        if(findUser) {
            await userModel.updateOne({ username : username }, { password : sha(newpassword) })
            res.send({ status : 200, type : "updatepassword", message : "Password Added Succefully" })
        }
    }
});

// Route to handle profile picture upload
route.post('/upload-profile/:username', upload.single('profile'), async (req, res) => {
    if (req.headers.authorization) {
      const ID = jwt.decode(req.headers.authorization, key);
      const username = req.params.username;
  
      // Check if file is uploaded
      if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded or invalid file type.' });
      }
  
      try {
        const isProfilePresent = await userModel.findOne({ username : username });
  
        if (isProfilePresent) {
          const existingImageKey = isProfilePresent?.profileimage?.s3key;
  
          // Delete the previous profile image from S3 if it exists
          if (existingImageKey) {
            await deleteImageFromS3(existingImageKey);
          }
  
          // Upload new profile image data
          const profileData = {
            originalname: req.file.originalname,
            s3key: req.file.key, // The S3 key (path) for the file
            s3url: req.file.location, // The URL to access the file
            updatedat: new Date()
          };
  
          // Update the user's profile with the new image data
          await userModel.updateOne({ username : username }, { profileimage: profileData });
  
          // Send the details back to the client
          return res.send({ status: 200, message: "Profile Uploaded Successfully", type: "profile", profile: profileData });
        } else {
          return res.status(404).send({ message: "User not found" });
        }
      } catch (err) {
        console.error('Error processing profile upload:', err);
        return res.status(500).send({ message: "Internal server error" });
      }
    } else {
    return res.status(401).send({ message: "Unauthorized request." });
    }
});

route.delete('/:username', async (req, res) => {
    try {
        // Check for the presence of the Authorization header
        if (req.headers.authorization) {
            // Decode the JWT token
            const token = req.headers.authorization;
            const decoded = jwt.verify(token, key); // Using jwt.verify instead of decode for security
            const username = req.params.username
            
            // Check if the requesting user exists
            const isAdmin = await adminModel.findOne({_id: decoded.id});
            const isUserPresent = await userModel.findOne({username: username});
            if (!isAdmin) {
                return res.status(404).send({status: 404, message: 'User not found'});
            }

            const extractUserId = isUserPresent?._id 

            // Delete the account based on the accountid parameter
            const deletionResult = await userModel.deleteOne({username : username});
            await notificationModel.deleteOne({userId: extractUserId});
            if (deletionResult.deletedCount === 0) {
                return res.status(404).send({status: 404, message: 'Account not found or already deleted'});
            }

            // Successful deletion response
            res.send({
                status: 200,
                type: 'delete',
                message: 'Account Deleted Successfully'
            });
        } else {
            // If no authorization header is present
            res.status(401).send({status: 401, message: 'Authorization header missing'});
        }
    } catch (error) {
        // Catch any errors that occur
        console.error(error);
        res.status(500).send({status: 500, message: 'An error occurred while deleting the account'});
    }
});

route.get('/:username', async(req, res) => {
    // console.log('Request received for user:', req.params.username);
    if(req.headers.authorization){
        const username = req.params.username
        let userData = await userModel.findOne({username : username});
        // console.log(userData)
        if(userData) {
            userData = {
                accountid : userData?.accountid,
                createdate : userData?.createdate,
                email :  userData?.email,
                highestrecord1min :  userData?.highestrecord1min,
                highestrecord3min : userData?.highestrecord3min,
                highestrecord5min : userData?.highestrecord5min,
                match_1 : userData?.match_1, 
                match_3 : userData?.match_3, 
                match_5 : userData?.match_5, 
                password : userData?.password ,
                profileimage : userData?.profileimage,
                top1minavg : userData?.top1minavg,
                top3minavg : userData?.top3minavg,
                top5minavg : userData?.top5minavg, 
                username : userData?.username,
                isblock : userData?.isblocked?.status
            }
        }
        res.send({status : 200, userData : userData, message : "User Data", type : "userData"})
    }
});



module.exports = route;