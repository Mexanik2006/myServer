import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { imageDB } from '../../firebase/Firebase';
import { Button, message, Upload, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function UploadVideo() {
    const [videoUrl, setVideoUrl] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUpload = (file) => {
        // Fayl nomini olish
        const fileName = file.name;
        const videoRef = ref(imageDB, `video/${fileName}`);
        const uploadTask = uploadBytesResumable(videoRef, file);

        setUploading(true);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Yuklash jarayonidagi progress foizini hisoblash
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                console.error("Error uploading video:", error);
                message.error(`${file.name} video upload failed.`);
                setUploading(false);
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                setVideoUrl((prevUrls) => [...prevUrls, url]);
                message.success(`${file.name} video uploaded successfully`);
                setUploading(false);
                setProgress(0); // Yuklash tugagandan so'ng progressni qayta o'rnatish
            }
        );

        // Avtomatik yuklashni to'xtatish uchun false qaytarish
        return false;
    };

    const props = {
        beforeUpload: (file) => {
            const isVideo = file.type.startsWith('video/');
            if (!isVideo) {
                message.error('You can only upload video files!');
                return false;
            }
            handleUpload(file);
            return false; // Sukut bo'yicha yuklashni oldini olish
        },
    };

    return (
        <div className='uploadvideo'>
            <Upload {...props}>
                <Button icon={<UploadOutlined />} disabled={uploading}>
                    {uploading ? 'Uploading' : 'Click to Upload Video'}
                </Button>
            </Upload>
            {uploading && <Progress percent={progress} style={{ marginTop: 16 }} />}
        </div>
    );
}

export default UploadVideo;
