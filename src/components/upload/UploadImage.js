import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { imageDB } from '../../firebase/Firebase';
import { v4 } from 'uuid';
import { Button, message, Upload, Progress, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

function UploadImage() {
    const [imgUrl, setImgUrl] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [selectedFolder, setSelectedFolder] = useState(''); // Select uchun state qo'shildi

    const handleUpload = (file) => {
        if (!selectedFolder) {
            message.error('Iltimos, yuklanadigan papkani tanlang.');
            return;
        }

        const imgRef = ref(imageDB, `images/${selectedFolder}/${v4()}`); // Papka nomini qo'shdik
        const uploadTask = uploadBytesResumable(imgRef, file);

        setUploading(true);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Progress foizini hisoblash
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
                message.success(`${file.name} file uploaded to ${selectedFolder} successfully`);
                setUploading(false);
                setProgress(0); // Muvaffaqiyatli yuklangandan keyin progressni qayta tiklash
            }
        );

        // Avtomatik yuklashni to'xtatish
        return false;
    };

    const handleFolderChange = (value) => {
        setSelectedFolder(value); // Papka tanlovini saqlash
    };

    const props = {
        beforeUpload: (file) => {
            handleUpload(file);
            return false; // Yuklashni qo'lda boshqarish
        },
    };

    return (
        <div className='uploadImage'>
            <Select
                placeholder="Papkani tanlang"
                style={{ width: 200, marginBottom: 16 }}
                onChange={handleFolderChange}
            >
                <Select.Option value="friends">Do'stlar</Select.Option>
                <Select.Option value="job">Ishlar</Select.Option>
                <Select.Option value="family">Oila</Select.Option>
                <Select.Option value="other">Boshqa</Select.Option>
            </Select>
            <Upload {...props}>
                <Button icon={<UploadOutlined />} disabled={uploading || !selectedFolder}>
                    {uploading ? 'Uploading' : 'Click to Upload image'}
                </Button>
            </Upload>
            {uploading && <Progress percent={progress} style={{ marginTop: 16 }} />}
        </div>
    );
}

export default UploadImage;
