import { NavLink } from "react-router-dom";
import Header from "../../../../shared/header/Header";
import Footer from "../../../../shared/footer/Footer";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { dynamicToast } from "../../../../shared/Toast/DynamicToast";
import DeleteBlogModal from "./modal/DeleteBlogModal";

const BlogPage = () => {

    const blogData = useSelector(state => state.AdminDataSlice.blog);
    const [getBlogId, setGetBlogId] = useState()

    useEffect(() => {
        if (localStorage.getItem('blogPosted')) {
            dynamicToast({ message: 'Blog Posted Successfully!', icon: 'success' });
            setTimeout(() => {
                localStorage.removeItem('blogPosted');
            }, 3500);
        }
    }, []);

    return (
        <>
            <Header />
            <section>
                <div className="container py-5">
                    <div className="row">
                        <div className="col-md-12">
                            <NavLink to="/admin/blog-add" className="add-blog-btn">
                                Add Blog <i className="fa-duotone fa-solid fa-plus fa-xl"></i>
                            </NavLink>
                        </div>
                        <div className="col-md-12 mt-5">
                            <div className="leaderboard-table my-3">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Edit</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {blogData && blogData.map((value, index) => (
                                            <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td><NavLink to={`/admin/blog/${value._id}`}>{value.title}</NavLink></td>
                                                    <td><NavLink to={`/admin/blog-add/${value._id}`}><i className="fa-regular  fa-pen-to-square fa-xl"></i></NavLink></td>
                                                    <td><button onClick={()=>setGetBlogId(value._id)} data-bs-toggle="modal" data-bs-target="#deleteblog"><i class="fa-solid fa-trash fa-xl"></i></button></td>
                                                </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <DeleteBlogModal props={getBlogId} />
        </>
    );
};

export default BlogPage;
