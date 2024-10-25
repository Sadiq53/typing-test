import Footer from "../../../../shared/footer/Footer"
import Header from "../../../../shared/header/Header"


const BlogInner = () => {
  return (
    <>
        <Header />

        <section>
            <div className="container py-5">
                <div className="row">
                    <div className="col-md-12">
                        <div className="blog-header">
                            <h1 className="heading">Heading Goes Here</h1>
                            <h className="post-time">Posted : 5 Days ago</h>
                        </div>
                        <div className="blog-banner my-4"><img src="/assets/images/blog-banner.png" alt="" /></div>
                        <div className="blog-content my-4">
                        This document provides guidelines on how to display a Sign in with Google button on your website or app. Your website or app must follow these guidelines to complete the app verification process.
                        Our Google Identity Services SDKs render a Sign in with Google button that always adheres to the most recent Google branding guidelines. They are the recommended way to display the Sign in with Google button on your website or app. For cases where you are not able to use the Google-rendered button option, you can render an HTML button element, download our pre-approved branding assets or optionally create a custom Sign in with Google button.
                        Render HTML Button Element
                        We provide an HTML configurator that allows you to customize the appearance of the Sign in with Google button. You can then download an HTML and CSS snippet that will render the button on your website.
                        Generate HTML Button Element
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Footer />
    </>
  )
}

export default BlogInner