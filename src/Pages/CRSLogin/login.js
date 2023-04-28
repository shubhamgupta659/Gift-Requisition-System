import React, { useContext, useEffect } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../AuthContext';
import axios from 'axios';

const CRSLogin = () => {
    const { setUsername, setUserImageSrc, setAccessToken } = useContext(AuthContext);
    const navigate = useNavigate();

    async function fetchToken() {
        let data = JSON.stringify({
            "username": "crsuser@unison.com",
            "password": "crspassword"
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://ap-southeast-1.aws.realm.mongodb.com/api/client/v2.0/app/data-gqwih/auth/providers/local-userpass/login',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data
        };

        await axios.request(config)
            .then((response) => {
                setAccessToken(response.data.access_token);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        setUsername('');
        setUserImageSrc('');
    }, []);

    const onFinish = (values) => {
        fetchToken();
        if (values.username === 'requser' && values.password === 'password') {
            setUsername(values.username);
            setUserImageSrc('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/106.jpg')
            navigate(`/reqDash`, { user: values.username });
        } else if (values.username === 'hoduser' && values.password === 'password') {
            setUsername(values.username);
            setUserImageSrc('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/420.jpg')
            navigate(`/hodDash`, { user: values.username });
        } else if (values.username === 'ssuuser' && values.password === 'password') {
            setUsername(values.username);
            setUserImageSrc('https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1091.jpg')
            navigate(`/ssuDash`, { user: values.username });
        } else {

        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className='login-container'>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default CRSLogin;