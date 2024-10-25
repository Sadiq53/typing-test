import Header from "../../../../shared/header/Header"
import Footer from "../../../../shared/footer/Footer"
import { NavLink } from "react-router-dom"
import BlogPost from "./BlogPost"


const Blog = () => {
  return (
    <>
        <Header />

        <section>
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-12">
                        <div>
                            <h1 className="font-active text-left">Blogs</h1>
                        </div>
                        <div className="blog-layout mt-5">
                            <BlogPost  />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Footer />
    </>
  )
}

export default Blog