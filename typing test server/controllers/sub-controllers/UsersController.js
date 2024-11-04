const route = require('express').Router();
const jwt = require('jsonwebtoken');
const sha = require('sha1')
const adminModel = require('../../model/AdminSchema')
const userModel = require('../../model/UserSchema')
const key = require('../../config/token_Keys');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique IDs
const randNum = require('random-number')

// Directory to store uploaded files temporarily
const uploadDir = path.resolve(__dirname, '../../assets/uploads/profile');
// console.log(uploadDir)

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
} 

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Save the file to the upload directory
    },
    filename: function (req, file, cb) {
        // Generate a unique name for the file (use timestamp + original extension)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname); // Get the file extension
        const newFilename = `${uniqueSuffix}${extension}`;
        cb(null, newFilename); // Set the new filename
    }
});


// Multer instance with limits and file type filter
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
    fileFilter: (req, file, cb) => {
        // Allow only .jpeg, .jpg, .png file types
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'), false);
        }
    }
});


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
                    profile : value?.profileimage?.newname,
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
    // console.log(req.params.username)
    if(req.headers.authorization) {
        const username = req.params.username
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded or invalid file type.' });
        }

        const isProfilePresent = await userModel.findOne({ username : username })

        if(isProfilePresent) {
            const getPath = isProfilePresent?.profileimage?.filepath;

            if (getPath) {
                fs.unlink(getPath, (err) => {
                    if (err) {
                        console.error("Failed to delete existing profile image:", err);
                    } else {
                        console.log("Existing profile image deleted successfully.");
                    }
                });
            }
            
            // File uploaded successfully
            const originalName = req.file.originalname;
            const newName = req.file.filename;
            const filePath = path.join(uploadDir, req.file.filename);
            
            const profileData = {
                originalname : originalName,
                newname : newName,
                filepath : filePath,
                updatedat : new Date()
            }
        
            await userModel.updateOne({username : username}, {profileimage : profileData});

            // Send the details back to the client
            return res.send({ status: 200, message: "Profile Uploaded Successfully", type: "profile", profile: profileData });
        }
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
            const checkAccount = await adminModel.findOne({_id: decoded.id});
            if (!checkAccount) {
                return res.status(404).send({status: 404, message: 'User not found'});
            }
            
            // Delete the account based on the accountid parameter
            const deletionResult = await userModel.deleteOne({username : username});
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