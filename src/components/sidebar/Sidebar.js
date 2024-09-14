import React, { useState } from 'react';
import { CloudUploadOutlined, HomeOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { SiAmazonsimpleemailservice } from "react-icons/si";
import { TbMailDown, TbPhotoDown, TbPhotoPlus } from 'react-icons/tb';
import { MdOutlineUploadFile } from 'react-icons/md';
import { LuFileDown } from 'react-icons/lu';
const items = [
    {
        key: '1',
        icon: <HomeOutlined />,
        label: 'Home',
        label: <Link to="/">Home</Link>

        // children: [
        //     {
        //         key: '11',
        //         label: 'Option 1',
        //     },
        //     {
        //         key: '12',
        //         label: 'Option 2',
        //     },
        //     {
        //         key: '13',
        //         label: 'Option 3',
        //     },
        //     {
        //         key: '14',
        //         label: 'Option 4',
        //     },
        // ],
    },
    {
        key: '2',
        icon: <CloudUploadOutlined />,
        label: 'Upload',
        children: [
            {
                key: '21',
                icon: <SiAmazonsimpleemailservice />,
                label: 'Upload address',
                label: <Link to="/upload">Upload address</Link>
            },
            {
                key: '22',
                icon: <MdOutlineUploadFile />,
                label: 'Upload file',
                label: <Link to="/uploadFile">Upload file</Link>
            },
            {
                key: '23',
                icon: <TbPhotoPlus />,
                label: 'Upload images',
                label: <Link to="/uploadImage">Upload image</Link>
            },
            // {
            //     key: '24',
            //     label: 'Submenu 2',
            //     children: [
            //         {
            //             key: '241',
            //             label: 'Option 1',
            //         },
            //         {
            //             key: '242',
            //             label: 'Option 2',
            //         },
            //         {
            //             key: '243',
            //             label: 'Option 3',
            //         },
            //     ],
            // },
        ],
    },
    {
        key: '3',
        icon: <CloudDownloadOutlined />,
        label: 'Download',
        children: [
            {
                key: '31',
                icon: <TbMailDown />,
                label: 'Download address',
                label: <Link to="/download">Download address</Link>
            },
            {
                key: '32',
                icon: <LuFileDown />,
                label: 'Download file',
                label: <Link to="/downloadFile">Download file</Link>
            },
            {
                key: '33',
                icon: <TbPhotoDown />,
                label: 'Download images',
                label: <Link to="/downloadImage">Download image</Link>
            }
        ],
    },
];
const getLevelKeys = (items1) => {
    const key = {};
    const func = (items2, level = 1) => {
        items2.forEach((item) => {
            if (item.key) {
                key[item.key] = level;
            }
            if (item.children) {
                func(item.children, level + 1);
            }
        });
    };
    func(items1);
    return key;
};
const levelKeys = getLevelKeys(items);
const Sidebar = () => {
    const [stateOpenKeys, setStateOpenKeys] = useState(['2', '23']);
    const onOpenChange = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
            setStateOpenKeys(
                openKeys
                    // remove repeat key
                    .filter((_, index) => index !== repeatIndex)
                    // remove current level all child
                    .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            // close
            setStateOpenKeys(openKeys);
        }
    };
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['231']}
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChange}
            items={items}
            className='menusidebar text-[white]'
        />
    );
};
export default Sidebar;