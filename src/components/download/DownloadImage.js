import React, { useEffect, useState } from 'react';
import { Image, Space } from 'antd';
import { DownloadOutlined, SwapOutlined, RotateLeftOutlined, RotateRightOutlined, ZoomOutOutlined, ZoomInOutlined, UndoOutlined } from '@ant-design/icons';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { imageDB } from '../../firebase/Firebase';

function DownloadImage() {
    const [imgUrls, setImgUrls] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const imgsRef = ref(imageDB, "files");
            try {
                const imgs = await listAll(imgsRef);
                const urls = await Promise.all(
                    imgs.items.map(async (item) => {
                        const url = await getDownloadURL(item);
                        return { url, name: item.name }; // Return both URL and name
                    })
                );
                setImgUrls(urls);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        fetchImages();
    }, []);

    // Log the first element of imgUrls
    useEffect(() => {
        if (imgUrls.length > 0) {
            console.log(imgUrls[0]); // Accessing the first element
        }
    }, [imgUrls]);

    const onDownload = (imgUrl, imgName) => {
        fetch(imgUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = imgName || 'downloaded-image.png'; // Use imgName for download
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(url);
                link.remove();
            })
            .catch(error => console.error('Error downloading the image:', error));
    };

    return (
        <div className='downImage'>
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
                        </Space>
                    ),
                }}
            >
                {imgUrls.map((img, index) => (
                    <Image
                        key={index}
                        src={img.url}
                        className='img'
                        onClick={() => onDownload(img.url, img.name)}
                    />
                ))}
            </Image.PreviewGroup>
        </div>
    );
}

export default DownloadImage;
