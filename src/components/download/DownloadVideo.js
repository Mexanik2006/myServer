import React, { useEffect, useState } from 'react';
import { Button, Table, message, Space, Avatar } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { getDownloadURL, listAll, ref, deleteObject } from 'firebase/storage';
import { imageDB } from '../../firebase/Firebase';
import { logoMap } from './components/LogoMap';

function DownloadVideo() {
    const [fileUrls, setFileUrls] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            const filesRef = ref(imageDB, "video"); // `video` papkasidan videolarni olish
            try {
                const files = await listAll(filesRef);
                const urls = await Promise.all(
                    files.items.map(async (item) => {
                        const url = await getDownloadURL(item);
                        return { url, name: item.name, ref: item }; // URL, fayl nomi va referensni qaytarish
                    })
                );
                setFileUrls(urls);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };

        fetchFiles();
    }, []);

    // Videoni yuklab olish
    const onDownload = (fileUrl, fileName) => {
        fetch(fileUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName || 'downloaded-video'; // Fayl nomini yuklashda ishlatish
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(url);
                link.remove();
            })
            .catch(error => console.error('Error downloading the video:', error));
    };

    // Videoni o'chirish
    const onDelete = async (fileRef, fileName) => {
        try {
            await deleteObject(fileRef);
            message.success(`${fileName} video deleted successfully.`);
            // Fayl o'chirilgandan so'ng ro'yxatdan o'chirish
            setFileUrls(prevUrls => prevUrls.filter(file => file.ref !== fileRef));
        } catch (error) {
            console.error('Error deleting the video:', error);
            message.error(`Failed to delete ${fileName}`);
        }
    };

    // Fayl kengaytmasiga asoslanib logotipni aniqlash

    // Jadval ustunlari
    const columns = [
        {
            title: 'Video nomi',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Ko\'rish',
            key: 'preview',
            render: (text, record) => (
                <video width="350" height="350px" controls>
                    <source src={record.url} type="video/mp4" />
                    Sizning brauzeringiz video formatini qo'llab-quvvatlamaydi.
                </video>
            ),
        },
        {
            title: 'Aksiyalar',
            key: 'actions',
            render: (text, record) => (
                <Space>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(record.ref, record.name)}
                        danger
                    >
                        O'chirish
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className='downvideo'>
            <Table
                columns={columns}
                dataSource={fileUrls}
                rowKey="name" // Unique key for each row
                pagination={false} // Disable pagination if not needed
                bordered
            />
        </div>
    );
}

export default DownloadVideo;
