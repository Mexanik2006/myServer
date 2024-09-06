import React, { useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
const items = [
    {
        key: '1',
        icon: <MailOutlined />,
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
        icon: <AppstoreOutlined />,
        label: 'Upload',
        children: [
            {
                key: '21',
                label: 'Upload address',
                label: <Link to="/upload">Upload address</Link>
            },
            {
                key: '22',
                label: 'Upload images',
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
        icon: <SettingOutlined />,
        label: 'Download',
        children: [
            {
                key: '31',
                label: 'Download address',
                label: <Link to="/download">Download address</Link>
            },
            {
                key: '32',
                label: 'Download images',
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