import ImgCrop from "antd-img-crop";
import React, { useState } from "react";
import { getImageUpload } from "../utils/cloudinary";
import { Container, Image } from "react-bootstrap";

const UploadImage = ({ onChange, setProgress, progress }) => {
  const handleUpload = async ({ file }) => {
    try {
      setProgress(0);

      const data = await getImageUpload(file, setProgress);
      const src = data?.url;
      if (src) {
        onChange({
          url: data?.url,
          publicId: data?.public_id,
          description: file?.name,
          width: data?.width,
          height: data?.height,
        });
        setProgress(100);
      }
    } catch (error) {
      console.log("err");
    }
  };
  return (
    // <Container>
    //   <
    //     accept="image/*"
    //     customRequest={handleUpload}
    //     showUploadList={false}
    //     progress={{
    //       strokeWidth: 4,
    //     }}
    //   >
    //     <Button>{progress === 100 ? "Hoàn tất" : "Tải lên"}</Button>
    //   </>
    // </Container>
  );
};

export default UploadImage;
