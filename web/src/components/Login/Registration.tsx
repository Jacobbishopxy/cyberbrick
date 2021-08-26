import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'

import './Login.less'

// TODO: get invitation ID from query
export interface RegistrationProps {
    onFinish: (value: API.Invitation) => Promise<any>
    onFinishFailed: (errorInfo: any) => void
}

export const Registration = (props: RegistrationProps) => {
    const [form] = Form.useForm();


    return (
        <Form
            name="normal-login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={props.onFinish}
            onFinishFailed={props.onFinishFailed}
            form={form}
        >
            <Form.Item
                name="email"
                wrapperCol={{ offset: 8, span: 8 }}
                rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                ]}
            >
                <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="E-mail" />
            </Form.Item>

            <Form.Item
                name="nickname"
                rules={[{ required: true, message: 'Please input your Username!', whitespace: true }]}
                wrapperCol={{ offset: 8, span: 8 }}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your Password!' },
                { min: 6, message: "Password must be minimal of 6 characters" }]}
                wrapperCol={{ offset: 8, span: 8 }}
                hasFeedback
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Password"
                />
            </Form.Item>

            <Form.Item
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[{ required: true, message: 'Please input your Password!' },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                }),
                ]}
                wrapperCol={{ offset: 8, span: 8 }}
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Confirm Password"
                />
            </Form.Item>


            <Form.Item
                wrapperCol={{ offset: 8, span: 8 }}
            >
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Register
                </Button>
            </Form.Item>
        </Form>
    )
}
