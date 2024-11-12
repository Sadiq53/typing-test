import React from "react";
import { useFormik } from "formik";
import Footer from "../../../../shared/footer/Footer";
import Header from "../../../../shared/header/Header";
import contactUsSchema from "../../../../../schemas/ContactUsSchema";
import axios from 'axios'
import {BASE_API_URL} from '../../../../../util/API_URL'
import {dynamicToast} from '../../../../shared/Toast/DynamicToast'

const Contact = () => {
  // Formik Setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema: contactUsSchema,
    onSubmit: async(formData) => {
      const response = await axios.post(`${BASE_API_URL}/contact`, formData)  
      if(response.data.status === 200) {
        dynamicToast({ message: 'Form Submitted Successfully!', timer: 3000, icon: 'success' })
      } else {
        dynamicToast({ message: 'Error Submitting Form Try Again Later', timer: 3000, icon: 'error' })
      }
    },
  });

  return (
    <>
      <Header />
      <section>
        <div className="container py-5">
          <div className="row">
            <div className="col-md-8 offset-md-1 col-10 offset-1">
              <div className="contact-section">
                <h4 className="font-active text-left">Free To Contact Us</h4>
                <div className="contact-div">
                  <div className="auth">
                    <input
                      type="text"
                      placeholder="Full Name"
                      {...formik.getFieldProps("name")}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className=" text-danger text-sm error">{formik.errors.name}</div>
                    )}
                  </div>

                  <div className="auth">
                    <input
                      type="email"
                      placeholder="Email Address"
                      {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-danger text-sm error">{formik.errors.email}</div>
                    )}
                  </div>
                </div>

                <div className="auth-cs">
                  <textarea
                    placeholder="Message"
                    {...formik.getFieldProps("message")}
                  />
                  {formik.touched.message && formik.errors.message && (
                    <div className=" text-danger text-sm error">{formik.errors.message}</div>
                  )}
                </div>
                <button className="theme-btn sm" onClick={formik.handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;
