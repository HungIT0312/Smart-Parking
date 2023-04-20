import axios from "axios";
const CloudinaryUpload = async (file, setProgress) => {
  const REACT_APP_CLOUDINARY_UPLOAD_PRESET = "x0ngxosk";
  const REACT_APP_CLOUDINARY_CLOUD_NAME = "dzdfqqdxs";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", REACT_APP_CLOUDINARY_UPLOAD_PRESET);

  const config = {
    onUploadProgress: (progressEvent) => {
      const total = progressEvent.total;
      const current = progressEvent.loaded;
      let percentCompleted = (current / total) * 100;
      setProgress(percentCompleted);
    },
  };
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      config
    );

    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default CloudinaryUpload;
