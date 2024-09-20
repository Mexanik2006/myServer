import React, { useState } from 'react'
import './Upload.css'
import { Button, Form, Input } from 'antd';
import axios from "../../api/Api"

function Upload() {
    const onFinish = async (values) => {
        console.log('Success:', values);

        let newComment = {
            url: values.url,
            forurl: values.forurl
        }

        try {
            await axios.post("/upload/create", newComment)
            window.alert("Muvafaqqiyatli joylandi")
        } catch (err) {
            console.log(err)
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        
            <div className="uploadpro">
                <Form
                    name="basic"
                    // style={{
                    //     maxWidth: 600,
                    // }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    className='formbg'
                >
                    <Form.Item
                        label="Url address"
                        name="url"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Url address!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="For"
                        name="forurl"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your for!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                      
                    >
                        <Button type="primary" htmlType="submit">
                            Send
                        </Button>
                    </Form.Item>
                </Form>
            </div>
    )
}

export default Upload
