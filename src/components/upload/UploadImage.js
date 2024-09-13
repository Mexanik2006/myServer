import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { imageDB } from '../../firebase/Firebase';
import { v4 } from 'uuid';
import { Button, message, Upload, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function UploadImage() {
    const [imgUrl, setImgUrl] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUpload = (file) => {
        const imgRef = ref(imageDB, `files/${v4()}`);
        const uploadTask = uploadBytesResumable(imgRef, file);

        setUploading(true);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Calculate progress percentage
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                console.error("Error uploading file:", error);
                message.error(`${file.name} file upload failed.`);
                setUploading(false);
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                setImgUrl((prevUrls) => [...prevUrls, url]);
                message.success(`${file.name} file uploaded successfully`);
                setUploading(false);
                setProgress(0); // Reset progress after successful upload
            }
        );

        // Prevent automatic upload
        return false;
    };

    const props = {
        beforeUpload: (file) => {
            handleUpload(file);
            return false; // Prevent the default behavior
        },
    };

    return (
        <div className='uploadImage'>
            <Upload {...props}>
                <Button icon={<UploadOutlined />} disabled={uploading}>
                    {uploading ? 'Uploading' : 'Click to Upload'}
                </Button>
            </Upload>
            {uploading && <Progress percent={progress} style={{ marginTop: 16 }} />}
        </div>
    );
}

export default UploadImage;
