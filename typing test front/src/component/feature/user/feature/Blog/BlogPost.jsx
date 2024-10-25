import { NavLink } from "react-router-dom"

const BlogPost = () => {

    const isToken = localStorage.getItem('userToken')

  return (
    <>
        <div className="blog-post my-3">
            <div className="blog-img"><NavLink to={`${isToken ? '/user/' : '/'}blog/${'demo'}`}><img src="/assets/images/blog.png" alt="" /></NavLink></div>
            <div className="blog-content">
                <NavLink to={`${isToken ? '/user/' : '/'}blog/${'demo'}`}><h1>Heading Goes Here</h1></NavLink>
                <p>Lorem Ipsum is simply dummy text of the 
                    printing and typesetting industry.</p>
            </div>
            <NavLink to={`${isToken ? '/user/' : '/'}blog/${'demo'}`}>Read More...</NavLink>
        </div>
    </>
  )
}

export default BlogPost