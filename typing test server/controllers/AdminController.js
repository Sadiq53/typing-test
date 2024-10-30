const route = require('express').Router();
const jwt = require('jsonwebtoken');
const sha = require('sha1')
const adminModel = require('../model/AdminSchema')
const userModel = require('../model/UserSchema')
const key = require('../config/token_Keys');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique IDs


// Directory to store uploaded files temporarily
// const uploadDir = path.resolve(__dirname, '../assets/uploads/profile');
const uploadDir = 'assets/uploads/profile';
// console.log(uploadDir)

// Directory to store uploaded files temporarily
// const uploadDirFeaturedImage = path.resolve(__dirname, '../assets/uploads/featuredImage');
const uploadDirFeaturedImage = 'assets/uploads/featuredImage';
// console.log(uploadDirFeaturedImage)

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
} else if (!fs.existsSync(uploadDirFeaturedImage)) {
    fs.mkdirSync(uploadDirFeaturedImage, { recursive: true });
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

// Multer storage configuration
const storageForFeaturedImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirFeaturedImage); // Save the file to the upload directory
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

// Multer instance with limits and file type filter
const uploadFeaturedImage = multer({
    storage: storageForFeaturedImage,
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

route.get('/', async(req, res) => {
    // console.log(req.headers.authorization)
    if(req.headers.authorization){
        let ID = jwt.decode(req.headers.authorization, key)
        let adminData = await adminModel.findOne({_id : ID?.id})
        adminData = {
            email : adminData?.email,
            username : adminData?.username,
            paragraphs : adminData?.paragraphs,
            blog : adminData?.blog
        }
        if(adminData) {
            res.send({ status : 200, adminData : adminData })
        }else{
            res.send({status : 403})
        }
    }
});

route.get('/get-user/:limit', async(req, res) => {
    // console.log('Request received for user:', req.headers.authorization);
    if(req.headers.authorization){
        const limit = req.params.limit
        const getAllUsers = await userModel.find({});

        const filteredData = getAllUsers?.map(value => {
            return {
                username : value?.username,
                profile : value?.profileimage?.newname,
                isblock : value?.isblocked?.status,
                createdate : value?.createdate
            }
        })
        res.send({status : 200, userData : filteredData, message : "All User Data", type : "userData"})
    }
});

route.get('/user/:username', async(req, res) => {
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

// Blog post route
route.post('/blog', uploadFeaturedImage.single('featuredImage'), async (req, res) => {
    if (req.headers.authorization) {
        const ID = jwt.decode(req.headers.authorization, key);
        const { title, content, date } = req.body;

        const isThisAdmin = await adminModel.findOne({ _id: ID?.id });
        if (isThisAdmin) {
            const blog = {
                title: title,
                content: content,
                createdat: date,
                featuredImage: {
                    name: req.file?.filename,
                    path: path.join(uploadDirFeaturedImage, req.file.filename)
                }
            };

            // Push the new blog into the admin's blog array
            await adminModel.updateOne({ _id: ID?.id }, { $push: { blog: blog } });

            // Extract updated blog data
            const extractBlogData = await adminModel.findOne({ _id: ID?.id });
            res.send({
                status: 200,
                type: 'blog',
                message: 'Blog Posted Successfully',
                blog: extractBlogData?.blog
            });
        } else {
            res.status(403).send({ status: 403, message: 'Unauthorized' });
        }
    } else {
        res.status(401).send({ status: 401, message: 'Authorization token required' });
    }
});

route.post('/blog/edit', uploadFeaturedImage.single('featuredImage'), async (req, res) => {
    if (req.headers.authorization) {
        const ID = jwt.decode(req.headers.authorization, key);
        const { title, content, date, id } = req.body;

        try {
            const isThisAdmin = await adminModel.findOne({ _id: ID?.id });
            
            if (!isThisAdmin) {
                return res.status(403).send({ status: 403, message: 'Unauthorized' });
            }

            // Find the specific blog post within the admin's blog array
            const blogPostIndex = isThisAdmin.blog.findIndex(blog => blog._id.toString() === id);
            if (blogPostIndex === -1) {
                return res.status(404).send({ status: 404, message: 'Blog post not found' });
            }

            const blogPost = isThisAdmin.blog[blogPostIndex];
            
            // Prepare the updated blog data, without changing the `featuredImage`
            const updatedBlogData = {
                ...blogPost._doc, // Use _doc to get the raw object without Mongoose methods
                title,
                content,
                createdat: date
            };

            // If a new file is uploaded, handle the old image deletion and update `featuredImage`
            if (req.file) {
                const oldImagePath = blogPost.featuredImage?.path;
                if (oldImagePath && fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Delete the old image file
                }
                updatedBlogData.featuredImage = {
                    name: req.file.filename,
                    path: req.file.path
                };
            }

            // Update the specific blog post in the blog array
            isThisAdmin.blog[blogPostIndex] = updatedBlogData;

            // Save the updated admin document
            await isThisAdmin.save();

            // Return the updated blog array
            const extractBlogData = await adminModel.findOne({ _id: ID?.id });
            res.send({
                status: 200,
                type: 'blog',
                message: 'Blog updated successfully',
                blog: extractBlogData?.blog
            });
        } catch (error) {
            console.error('Error updating blog:', error);
            res.status(500).send({ status: 500, message: 'Internal server error' });
        }
    } else {
        res.status(401).send({ status: 401, message: 'Authorization token required' });
    }
});

route.delete('/blog/delete/:blogId', async (req, res) => {
    if (req.headers.authorization) {
        const ID = jwt.decode(req.headers.authorization, key);
        const { blogId } = req.params;

        try {
            const isThisAdmin = await adminModel.findOne({ _id: ID?.id });
            
            if (!isThisAdmin) {
                return res.status(403).send({ status: 403, message: 'Unauthorized' });
            }

            // Find the index of the blog post to delete
            const blogPostIndex = isThisAdmin.blog.findIndex(blog => blog._id.toString() === blogId);
            if (blogPostIndex === -1) {
                return res.status(404).send({ status: 404, message: 'Blog post not found' });
            }

            const blogPost = isThisAdmin.blog[blogPostIndex];
            
            // If the blog post has a featured image, delete the image file
            if (blogPost.featuredImage?.path && fs.existsSync(blogPost.featuredImage.path)) {
                fs.unlinkSync(blogPost.featuredImage.path);
            }

            // Remove the blog post from the blog array
            isThisAdmin.blog.splice(blogPostIndex, 1);

            // Save the updated admin document
            await isThisAdmin.save();

            res.send({
                status: 200,
                message: 'Blog post deleted successfully',
                type : 'blogDelete'
            });
        } catch (error) {
            console.error('Error deleting blog post:', error);
            res.status(500).send({ status: 500, message: 'Internal server error' });
        }
    } else {
        res.status(401).send({ status: 401, message: 'Authorization token required' });
    }
});







module.exports = route;