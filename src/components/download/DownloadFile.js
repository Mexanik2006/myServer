import React, { useEffect, useState } from 'react';
import { Button, Table, message, Space, Avatar } from 'antd';
import { DownloadOutlined, FileOutlined, DeleteOutlined } from '@ant-design/icons';
import { getDownloadURL, listAll, ref, deleteObject } from 'firebase/storage';
import { imageDB } from '../../firebase/Firebase';
import { logoMap } from './components/LogoMap'


function DownloadFile() {
    const [fileUrls, setFileUrls] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            const filesRef = ref(imageDB, "files"); // `files` papkasidan fayllarni olish
            try {
                const files = await listAll(filesRef);
                const urls = await Promise.all(
                    files.items.map(async (item) => {
                        const url = await getDownloadURL(item);
                        return { url, name: item.name, ref: item }; // URL, fayl nomi va fayl referensini qaytarish
                    })
                );
                setFileUrls(urls);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };

        fetchFiles();
    }, []);

    // Faylni yuklab olish
    const onDownload = (fileUrl, fileName) => {
        fetch(fileUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName || 'downloaded-file'; // Fayl nomini yuklashda ishlatish
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(url);
                link.remove();
            })
            .catch(error => console.error('Error downloading the file:', error));
    };

    // Faylni ochish
    const onOpenFile = (fileUrl) => {
        window.open(fileUrl, '_blank'); // Faylni yangi tabda ochish
    };

    // Faylni o'chirish
    const onDelete = async (fileRef, fileName) => {
        try {
            await deleteObject(fileRef);
            message.success(`${fileName} file deleted successfully.`);
            // Fayl o'chirilgandan so'ng ro'yxatdan o'chirish
            setFileUrls(prevUrls => prevUrls.filter(file => file.ref !== fileRef));
        } catch (error) {
            console.error('Error deleting the file:', error);
            message.error(`Failed to delete ${fileName}`);
        }
    };

    // Determine the logo based on file extension
    const getLogo = (fileName) => {
        const extension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2);
        return logoMap[`.${extension}`] || 'https://via.placeholder.com/32'; // Default logo if extension not found
    };

    // Define columns for Table with logos
    const columns = [
        {
            title: 'Logo',
            key: 'logo',
            render: (text, record) => (
                <Avatar src={getLogo(record.name)} size="default" />
            ),
        },
        {
            title: 'Fayl nomi',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Aksiyalar',
            key: 'actions',
            render: (text, record) => (
                <Space>
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={() => onOpenFile(record.url)}
                    >
                        Yuklab olish
                    </Button>
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
        <div className='downfile'>
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

export default DownloadFile;
