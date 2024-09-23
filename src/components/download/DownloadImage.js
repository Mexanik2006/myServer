import React, { useEffect, useState } from 'react';
import { Image, Space, Select, Empty, message } from 'antd';
import { DownloadOutlined, SwapOutlined, RotateLeftOutlined, RotateRightOutlined, ZoomOutOutlined, ZoomInOutlined, UndoOutlined, DeleteOutlined } from '@ant-design/icons';
import { getDownloadURL, listAll, ref, deleteObject } from 'firebase/storage';
import { imageDB } from '../../firebase/Firebase';

function DownloadImage() {
    const [imgUrls, setImgUrls] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState(''); // Boshlang'ich holatda barcha rasmlar ko'rsatiladi.
    const [loading, setLoading] = useState(true); // Yuklanish jarayonini boshqarish

    // Barcha rasmlarni va ichki papkalardagi rasmlarni olish uchun funksiyamiz
    const fetchAllImages = async () => {
        const baseRef = ref(imageDB, 'images');
        setLoading(true);
        try {
            const folders = await listAll(baseRef); // Asosiy papkadagi hamma narsani olish (fayllar va papkalar)

            // Ichki papkalarni tekshirish
            let allUrls = [];
            for (const folderRef of folders.prefixes) {
                const folderItems = await listAll(folderRef); // Har bir papkani ichida nima borligini olish
                const urls = await Promise.all(
                    folderItems.items.map(async (item) => {
                        const url = await getDownloadURL(item);
                        return { url, name: item.name, fullPath: item.fullPath }; // fullPath rasmni o'chirish uchun ishlatiladi
                    })
                );
                allUrls = [...allUrls, ...urls]; // Hamma URL larni qo'shish
            }

            // Asosiy papkadagi fayllarni ham qo'shamiz
            const rootFiles = await Promise.all(
                folders.items.map(async (item) => {
                    const url = await getDownloadURL(item);
                    return { url, name: item.name, fullPath: item.fullPath }; // fullPath rasmni o'chirish uchun ishlatiladi
                })
            );

            allUrls = [...allUrls, ...rootFiles]; // Asosiy papkadagi rasmlar va ichki papkalarni birlashtirish
            setImgUrls(allUrls);
        } catch (error) {
            console.error("Error fetching all images:", error);
        }
        setLoading(false);
    };

    // Faqat bitta papkadagi rasmlarni olish
    const fetchImagesFromFolder = async (folder) => {
        const imgsRef = ref(imageDB, `images/${folder}`);
        setLoading(true);
        try {
            const imgs = await listAll(imgsRef);
            const urls = await Promise.all(
                imgs.items.map(async (item) => {
                    const url = await getDownloadURL(item);
                    return { url, name: item.name, fullPath: item.fullPath }; // fullPath rasmni o'chirish uchun ishlatiladi
                })
            );
            setImgUrls(urls);
        } catch (error) {
            console.error(`Error fetching images from folder ${folder}:`, error);
        }
        setLoading(false);
    };

    useEffect(() => {
        // Sahifaga kirganda barcha rasmlarni olish
        fetchAllImages();
    }, []);

    useEffect(() => {
        // Tanlangan papkaga qarab rasmlarni olish
        if (selectedFolder === '') {
            fetchAllImages(); // Barcha papkalardagi rasmlarni olish
        } else {
            fetchImagesFromFolder(selectedFolder); // Faqat tanlangan papkadagi rasmlarni olish
        }
    }, [selectedFolder]);

    const onDownload = (imgUrl, imgName) => {
        fetch(imgUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = imgName || 'downloaded-image.png'; // Yuklab olish nomini belgilash
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(url);
                link.remove();
            })
            .catch(error => console.error('Error downloading the image:', error));
    };

    const handleFolderChange = (value) => {
        setSelectedFolder(value); // Papka tanlovini saqlash
    };

    const handleDelete = async (fullPath, imgName) => {
        const imgRef = ref(imageDB, fullPath); // Firebase'dan o'chirish uchun fayl manzili
        try {
            await deleteObject(imgRef); // Firebase'dan rasmni o'chirish
            message.success(`${imgName} muvaffaqiyatli o'chirildi`);
            setImgUrls((prevUrls) => prevUrls.filter((img) => img.fullPath !== fullPath)); // Frontend'dan o'chirish
        } catch (error) {
            console.error('Error deleting image:', error);
            message.error('Rasmni o\'chirishda xatolik yuz berdi.');
        }
    };

    return (
        <div className="">
            <Select
                placeholder="Papkani tanlang"
                style={{ width: 200, marginBottom: 16 }}
                onChange={handleFolderChange}
                defaultValue="" // Sahifaga kirganda "Hamma" variantini tanlash
            >
                <Select.Option value="">Tanlang...</Select.Option> {/* Hamma papka tanlansa barcha rasmlar chiqadi */}
                <Select.Option value="friends">Do'stlar</Select.Option>
                <Select.Option value="job">Ishlar</Select.Option>
                <Select.Option value="family">Oila</Select.Option>
                <Select.Option value="other">Boshqa</Select.Option>
            </Select>

            <div className='downImage'>
                {loading ? (
                    <p>Yuklanmoqda...</p> // Yuklanayotgan holatda xabar chiqadi
                ) : imgUrls.length === 0 ? (
                    <Empty description="Rasm yo'q" /> // Agar rasm bo'lmasa "Rasm yo'q" xabari chiqadi
                ) : (
                    <Image.PreviewGroup
                        preview={{
                            toolbarRender: (
                                _,
                                {
                                    image: { url },
                                    transform: { scale },
                                    actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn, onReset },
                                },
                            ) => (
                                <Space size={12} className="toolbar-wrapper">

                                    <DownloadOutlined onClick={() => onDownload(url)} />
                                    <SwapOutlined rotate={90} onClick={onFlipY} />
                                    <SwapOutlined onClick={onFlipX} />
                                    <RotateLeftOutlined onClick={onRotateLeft} />
                                    <RotateRightOutlined onClick={onRotateRight} />
                                    <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                                    <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                                    <UndoOutlined onClick={onReset} />
                                    <DeleteOutlined onClick={() => handleDelete(url, 'Rasm nomi')} />
                                </Space>
                            ),
                        }}
                    >
                        {imgUrls.map((img, index) => (
                            <Space key={index} direction="vertical">
                                <Image
                                    src={img.url}
                                    className='img'
                                    onClick={() => onDownload(img.url, img.name)}
                                />
                            </Space>
                        ))}
                    </Image.PreviewGroup>
                )}
            </div>
        </div>
    );
}

export default DownloadImage;
