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
        <div>
            <div className="m-auto">
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
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
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Send
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Upload
