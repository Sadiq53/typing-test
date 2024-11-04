import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill theme
import { dynamicToast } from '../../shared/Toast/DynamicToast';
import { useDispatch, useSelector } from 'react-redux';
import { handleAddBlogPost, handleEditBlogPost, resetState } from '../../../redux/AdminDataSlice';
import { useNavigate, useParams } from 'react-router-dom';
import StateCircleLoader from '../../shared/loader/StateCircleLoader';
import { BASE_API_URL } from '../../../util/API_URL'
import AddBlogCategory from './blogElements/AddBlogCategory';

const BlogEditor = () => {
    const [content, setContent] = useState({ content: '', title: '', description : '', category : [], status : '', tags : [] });
    const [imageData, setImageData] = useState();
    const featuredImage = useRef(null);
    const dispatch = useDispatch();
    const [displayData, setDisplayData] = useState([])
    const blogData = useSelector(state => state.AdminDataSlice.blog)
    const adminData = useSelector(state => state.AdminDataSlice.adminData)
    const isFullfilled = useSelector(state => state.AdminDataSlice.isFullfilled);
    const fullFillMsg = useSelector(state => state.AdminDataSlice.fullFillMsg);
    const isProcessing = useSelector(state => state.AdminDataSlice.isProcessing);
    const processingMsg = useSelector(state => state.AdminDataSlice.processingMsg);
    const isError = useSelector(state => state.AdminDataSlice.isError);
    const errorMsg = useSelector(state => state.AdminDataSlice.errorMsg);
    const [loader, setLoader] = useState({state : false, type : ''});
    const [error, setError] = useState({state : false, type : '', message : ''})
    const navigate = useNavigate();
    const param = useParams();
    const [saveBtn, setSaveBtn] = useState('')
    const [addCategory, setAddCategory] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [blogCategory, setBlogCategory] = useState(null);
    const [tagInput, setTagInput] = useState('');

    // Handle image selection from file input
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        
        if (!file) return;

        // Check the file type for additional validation
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            dynamicToast({ message: 'Please upload a valid image file (jpeg, jpg, or png).', icon: 'error' });
            return;
        }

        setImageData(file);

        if (file) {
            const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        }
    };

    useEffect(()=>{
        if(adminData){
            setBlogCategory(adminData?.blogCategory)
        }
    }, [adminData])

    const handleCheckboxChange = (category) => {
        setContent((prevContent) => ({
            ...prevContent,
            category: prevContent.category.includes(category)
                ? prevContent.category.filter((item) => item !== category) // Remove if already selected
                : [...prevContent.category, category] // Add if not selected
        }));
    };
    


    useEffect(()=>{
        if(param?.id) {
            if(blogData) {
                const filterData = blogData?.filter(value => value._id === param?.id)
                setDisplayData(filterData[0])
                setContent({
                    title : filterData[0]?.title,
                    content : filterData[0]?.content,
                    description : filterData[0]?.description,
                    category : filterData[0]?.category,
                    status : filterData[0]?.status,
                    tags : filterData[0]?.tags
                })
            }
        }
    }, [blogData])

    const handleContentChange = (value) => {
        setContent({ ...content, content: value });
    };

    const handleSave = () => {
        // Prepare the file for upload
        const profileData = new FormData();
        if(imageData) {
            profileData.append('featuredImage', imageData);
        }
        profileData.append('title', content.title);
        profileData.append('content', content.content);
        profileData.append('description', content.description);
        profileData.append('date', new Date());
        profileData.append('category', JSON.stringify(content.category))
        profileData.append('status', content.status)
        profileData.append('tags', JSON.stringify(content.tags))
    
        if(param?.id) {
            profileData.append('id', displayData?._id)
            dispatch(handleEditBlogPost(profileData))
        } else dispatch(handleAddBlogPost(profileData));

    };

    useEffect(() => {
        if(isFullfilled) {
            if (fullFillMsg?.type === 'blog') {
                setLoader({state : false, type : ''});
                dynamicToast({ message: 'Blog Posted Successfully!', icon: 'success' });
                saveBtn === 'saveExit' ? navigate('/admin/blog') : null
                dispatch(resetState());
            }
            dispatch(resetState());
        }
    }, [isFullfilled, fullFillMsg]);

    useEffect(() => {
        if(isProcessing) {
            setLoader({state : true, type : processingMsg?.type});
            dispatch(resetState());
        }
    }, [isProcessing, processingMsg]);


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!content.tags.includes(tagInput.trim())) {
                setContent((prevContent) => ({
                    ...prevContent,
                    tags: [...prevContent.tags, tagInput.trim()]
                }));
                setTagInput('');
            }
        }
    };

    const removeTag = (index) => {
        setContent((prevContent) => ({
            ...prevContent,
            tags: prevContent.tags.filter((_, i) => i !== index)
        }));
    };

    const handleInputChange = (e) => {
        setTagInput(e.target.value);
    };

    return (
        <>
            <section>
                <div className="container pb-5 pt-7">
                    <div className="row align-items-center">
                        <div className=" col-md-9">
                            <div className="blog-main-layout">
                                    <h2 className='text-center'>{param?.id ? 'Update Blog Post' : 'Create New Blog Post'}</h2>
                                <div className="blog-form-cs">
                                    <div className='my-3'>
                                        <label className='font-active' htmlFor="Title">Enter Post Title: &nbsp;</label>
                                        <input className='form-control' placeholder='Enter Your Blog Title Here' type="text" value={content.title} onChange={(event) => setContent({ ...content, title: event.target.value })} name="title" />
                                    </div>
                                    <div className='my-3'>
                                        <label className='font-active' htmlFor="Title">Description: &nbsp;</label>
                                        <input className='form-control' placeholder='Brief Description of Your Blog' type="text" value={content.description} onChange={(event) => setContent({ ...content, description: event.target.value })} name="title" />
                                    </div>
                                </div>
                                <div className="blog-editor">
                                    <ReactQuill
                                        value={content.content}
                                        onChange={handleContentChange}
                                        placeholder="Write your blog post here..."
                                        modules={BlogEditor.modules}
                                        formats={BlogEditor.formats}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="blog-side-layout">
                                <div className="blog-main-layout">
                                    <div className="blog-side-header">
                                        Publish
                                    </div>
                                    <div className="publish-btn py-3">
                                        <button className='btn btn-primary' onClick={()=>{handleSave(), setSaveBtn('save')}}>Save Post</button>
                                        <button className='btn btn-primary' onClick={()=>{handleSave(), setSaveBtn('saveExit')}}>Save & Exit</button>
                                    </div>
                                </div>
                                <div className="blog-main-layout">
                                    <div className="blog-side-header">
                                        Status
                                    </div>
                                    <select
                                        className="select2 my-3 form-control custom-select select2-hidden-accessible"
                                        onChange={(event)=>setContent({...content, status : event.target.value})}
                                        value={content?.status}
                                        data-select2-id="select2-data-7-idkc"
                                        tabIndex={-1}
                                        aria-hidden="true"
                                    >
                                        <option data-select2-id="select2-data-9-7ovj">Select</option>
                                        <option data-select2-id="select2-data-9-7ovj">Published</option>
                                        <option data-select2-id="select2-data-9-7ovj">Draft</option>
                                        <option data-select2-id="select2-data-9-7ovj">Pending</option>
                                    </select>
                                    
                                </div>
                                <div className="blog-main-layout">
                                    <div className="blog-side-header">
                                        category
                                    </div>
                                    <div className="show-category">
                                        <div className="blog-category">
                                            {blogCategory?.length !== 0 ? (
                                                blogCategory?.map((value, index) => (
                                                    <div key={index} className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`category-${index}`}
                                                            checked={content?.category?.includes(value)}
                                                            onChange={() => handleCheckboxChange(value)}
                                                        />
                                                        <label className="form-check-label" htmlFor={`category-${index}`}>
                                                            {value}
                                                        </label>
                                                    </div>
                                                ))
                                            ) : (
                                                "No Category Added"
                                            )}
                                        </div>
                                    </div>
                                    <div className="add-category">
                                        <button onClick={()=>setAddCategory(!addCategory)} className='btn text-info'>+ Add Category</button>
                                        {
                                            addCategory ? (
                                                <AddBlogCategory />
                                            ) : null
                                        }
                                    </div>
                                </div>
                                <div className="blog-main-layout">
                                    <div className="blog-side-header">
                                        Image
                                    </div>
                                    <div className='blog-img-container my-3' onClick={()=>featuredImage?.current?.click()}>
                                        {imagePreview ? (
                                            <img className='blog-image' src={imagePreview} alt="Preview" />
                                        ) : param?.id ? (
                                            <img className='blog-image' src={`${BASE_API_URL}/uploads/featuredImage/${displayData?.featuredImage?.name}`} alt="Preview" />
                                        ) : null}
                                    </div>
                                    <input
                                        type="file"
                                        ref={featuredImage}
                                        onChange={handleImageChange}
                                        style={{display : "none"}}
                                    />
                                    <div className='' >
                                        <label className=' text-primary' htmlFor="fileInput" >
                                        Choose image
                                        </label>
                                    </div>
                                </div>
                                <div className="blog-main-layout">
                                    <div className="blog-side-header">
                                        Tags
                                    </div>
                                    <div className="tag-input-container">
                                        <div className="tag-list" onClick={() => document.getElementById('hidden-input').focus()}>
                                            {content.tags.map((tag, index) => (
                                                <div key={index} className="tag-item">
                                                    {tag}
                                                    <button type="button" onClick={() => removeTag(index)}>✕</button>
                                                </div>
                                            ))}
                                            <input
                                                id="hidden-input"
                                                type="text"
                                                value={tagInput}
                                                onChange={handleInputChange}
                                                onKeyDown={handleKeyDown}
                                                className="hidden-input"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {loader?.state && loader?.type === 'blog' && <StateCircleLoader />}
        </>
    );
};

// Optional: Customize toolbar options
BlogEditor.modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean'], // remove formatting
    ],
};

BlogEditor.formats = [
    'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline',
    'strike', 'blockquote', 'code-block', 'color', 'background',
    'align', 'link', 'image', 'video',
];

export default BlogEditor;
