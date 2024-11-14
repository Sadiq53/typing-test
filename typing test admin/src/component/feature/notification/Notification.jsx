import { useState } from "react";
import { ADMIN_API_URL } from '../../../util/API_URL';
import axios from 'axios'
import {dynamicToast} from '../../shared/Toast/DynamicToast'


const Notification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);  // State to hold image preview

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));  // Show the image preview
    }
  };

  const sendNotification = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('message', message);
      formData.append('url', url);
      if (imagePreview) {
        formData.append('image', imagePreview);  // Append the image to the form data
      }

      const response = await axios.post(`${ADMIN_API_URL}/send-notification`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
        },
      });

      if(response.data.success) {
      dynamicToast({ message: 'Notification Sent Successfully!', timer : 3000, icon: 'success' });
      } else {
        dynamicToast({ message: 'Error Sending Notification!', timer : 3000, icon: 'error' });
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send notification");
    }
  };

  return (
    <>
      <section>
        <div className="container pb-5 pt-7">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <div className="notification-layout">
                <h2>Send Notification</h2>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notification Title"
                />
                <input
                  type="url"
                  className="form-control"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Notification URL"
                />
                <textarea
                  value={message}
                  className="form-control"
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Notification Message"
                />
                
                {/* Image Upload Section */}
                <div className="mb-3">
                  <label className="form-label">Add Image</label>
                  <div
                    className="image-upload-box"
                    onClick={() => document.getElementById("imageInput").click()}
                  >
                    {!imagePreview ? (
                      <span>Click to upload an image</span>
                    ) : (
                      <img
                        src={imagePreview}
                        alt="Selected"
                      />
                    )}
                  </div>
                  <input
                    id="imageInput"
                    type="file"
                    name="image"
                    className="form-control"
                    accept="image/*"
                    onChange={handleChange}
                    style={{ display: "none" }} // Hide the default file input
                  />
                </div>
                
                <button className="btn btn-primary" onClick={sendNotification}>Send Notification</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Notification;
