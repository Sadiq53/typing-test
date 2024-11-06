const route = require('express').Router();
const jwt = require('jsonwebtoken');
const adminModel = require('../../model/AdminSchema')
const key = require('../../config/token_Keys');
const path = require('path');
const fs = require('fs');
const multer = require('multer');


// Directory to store uploaded files temporarily
const uploadDirFeaturedImage = path.resolve(__dirname, '../../assets/uploads/featuredImage');
// console.log(uploadDirFeaturedImage)

// Ensure the upload directory exists
if (!fs.existsSync(uploadDirFeaturedImage)) {
    fs.mkdirSync(uploadDirFeaturedImage, { recursive: true });
}

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


// Blog post route
route.post('/', uploadFeaturedImage.single('featuredImage'), async (req, res) => {
    console.log(req.body);
    if (req.headers.authorization) {
        const ID = jwt.decode(req.headers.authorization, key);
        const { title, content, date, description, status, category, tags } = req.body;

        const isThisAdmin = await adminModel.findOne({ _id: ID?.id });
        if (isThisAdmin) {
            const newBlog = {
                title: title,
                content: content,
                status: status,
                tags: JSON.parse(tags),
                category: JSON.parse(category),
                createdat: date,
                description: description,
                featuredImage: {
                    name: req.file?.filename,
                    path: path.join(uploadDirFeaturedImage, req.file.filename)
                }
            };

            // Push the new blog into the admin's blog array and retrieve only the new entry
            const updateResult = await adminModel.findOneAndUpdate(
                { _id: ID?.id },
                { $push: { blog: newBlog } },
                { new: true, projection: { "blog": { $slice: -1 } } }
            );

            const latestBlog = updateResult.blog[0]; // Only the newly added blog

            res.send({
                status: 200,
                type: 'blog',
                message: 'Blog Posted Successfully',
                blog: latestBlog
            });
        } else {
            res.status(403).send({ status: 403, message: 'Unauthorized' });
        }
    } else {
        res.status(401).send({ status: 401, message: 'Authorization token required' });
    }
});

route.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    try {
        // Find the admin document
        const admin = await adminModel.findOne();

        if (!admin || !admin.blog) {
            return res.status(404).json({ status: 404, message: 'No blogs found' });
        }

        // Filter and paginate blogs within the blog array
        const publishedBlogs = admin.blog;
        const totalBlogs = publishedBlogs.length;

        // Paginate the filtered blogs
        const paginatedBlogs = publishedBlogs.slice(skip, skip + limit);

        res.status(200).json({
            status: 200,
            data: paginatedBlogs,
            totalBlogs,
            currentPage: page,
            totalPages: Math.ceil(totalBlogs / limit),
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ status: 500, message: 'Internal server error' });
    }
});

route.post('/edit', uploadFeaturedImage.single('featuredImage'), async (req, res) => {
    if (req.headers.authorization) {
        const ID = jwt.decode(req.headers.authorization, key);
        const { title, content, date, id, description, status } = req.body;

        // Parse `category` and `tags` fields from JSON.stringify format
        let category = [];
        let tags = [];
        try {
            category = JSON.parse(req.body.category);
            tags = JSON.parse(req.body.tags);
        } catch (parseError) {
            console.error('Error parsing category or tags:', parseError);
            return res.status(400).send({ status: 400, message: 'Invalid format for category or tags' });
        }

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
                description,
                category,
                status,
                tags,
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

            // Return only the updated blog post
            res.send({
                status: 200,
                type: 'blog',
                message: 'Blog updated successfully',
                blog: updatedBlogData
            });
        } catch (error) {
            console.error('Error updating blog:', error);
            res.status(500).send({ status: 500, message: 'Internal server error' });
        }
    } else {
        res.status(401).send({ status: 401, message: 'Authorization token required' });
    }
});

route.delete('/delete/:blogId', async (req, res) => {
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

route.post('/category', async (req, res) => {
    if (req.headers.authorization) {
        const ID = jwt.decode(req.headers.authorization, key);
        const { category } = req.body;
        
        const isThisAdmin = await adminModel.findOne({ _id: ID?.id });
        
        if (!isThisAdmin) {
            return res.status(403).send({ status: 403, message: 'Unauthorized' });
        }

        // Check if the category already exists (case-insensitive)
        const categoryExists = isThisAdmin.blogCategory?.some(
            (cat) => cat.toLowerCase() === category.toLowerCase()
        );

        if (categoryExists) {
            return res.send({
                status: 409,
                message: 'Category already exists',
                type: 'addBlogCategory'
            });
        }

        // Add the new category if it doesn't exist
        await adminModel.updateOne({ _id: ID?.id }, { $push: { blogCategory: category } });
        
        res.send({
            status: 200,
            message: 'Blog Category added successfully',
            type: 'addBlogCategory'
        });
    } else {
        res.status(401).send({ status: 401, message: 'Authorization header missing' });
    }
});






module.exports = route;