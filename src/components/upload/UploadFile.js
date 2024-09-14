import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { imageDB } from '../../firebase/Firebase';
import { Button, message, Upload, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function UploadFile() {
    const [imgUrl, setImgUrl] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUpload = (file) => {
        // Fayl nomini olish
        const fileName = file.name;
        const imgRef = ref(imageDB, `files/${fileName}`);
        const uploadTask = uploadBytesResumable(imgRef, file);

        setUploading(true);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Yuklash jarayonidagi progress foizini hisoblash
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
                setProgress(0); // Yuklash tugagandan so'ng progressni qayta o'rnatish
            }
        );

        // Avtomatik yuklashni to'xtatish uchun false qaytarish
        return false;
    };

    const props = {
        beforeUpload: (file) => {
            handleUpload(file);
            return false; // Sukut bo'yicha yuklashni oldini olish
        },
    };

    return (
        <div className='uploadFile'>
            <Upload {...props}>
                <Button icon={<UploadOutlined />} disabled={uploading}>
                    {uploading ? 'Uploading' : 'Click to Upload File'}
                </Button>
            </Upload>
            {uploading && <Progress percent={progress} style={{ marginTop: 16 }} />}
        </div>
    );
}

export default UploadFile;
