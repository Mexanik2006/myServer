import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { imageDB } from '../../firebase/Firebase';
import { v4 } from 'uuid';
import { Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function UploadImage() {
    const [imgUrl, setImgUrl] = useState([]);

    const handleUpload = async (file) => {
        const imgRef = ref(imageDB, `files/${v4()}`);
        try {
            await uploadBytes(imgRef, file);
            const url = await getDownloadURL(imgRef);
            setImgUrl((prevUrls) => [...prevUrls, url]);
            message.success(`${file.name} file uploaded successfully`);
        } catch (error) {
            console.error("Error uploading file:", error);
            message.error(`${file.name} file upload failed.`);
        }
    };

    const props = {
        beforeUpload: (file) => {
            handleUpload(file);
            // Prevent automatic upload
            return false;
        },
    };

    return (
        <div className='uploadImage'>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
        </div>
    );
}

export default UploadImage;
