import axios from "axios";

const IMGBB_API_KEY = "f420a0de8e3d492e668b07a7627fca40";

const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData
    );

    return {
      success: true,
      url: response.data.data.url,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Image upload failed",
    };
  }
};

export default uploadImage;
