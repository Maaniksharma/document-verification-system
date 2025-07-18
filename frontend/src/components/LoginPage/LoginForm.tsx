import { Button, Input, Radio, Form } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

import { type Credentials } from "../../api/auth";

interface LoginFormProps {
  submitHandler: (data: Credentials) => void;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ submitHandler, isLoading }) => {
  return (
    <Form
      className="w-[300px]"
      onFinish={(data) => {
        submitHandler(data as Credentials);
      }}
    >
      <Form.Item name={"email"} rules={[{ required: true }]}>
        <Input placeholder="Email" type="email" />
      </Form.Item>
      <Form.Item name={"password"} rules={[{ required: true }]}>
        <Input.Password
          placeholder="Password"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>

      <div className="flex flex-col gap-[4px]">
        <div className="text-sm font-medium">Select role</div>
        <Form.Item name="role" rules={[{ required: true }]}>
          <Radio.Group buttonStyle="solid" size="small">
            <Radio.Button value="reader">Reader</Radio.Button>
            <Radio.Button value="officer">Officer</Radio.Button>
            <Radio.Button value="admin">Admin</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </div>
      <Button
        className="w-full"
        type="primary"
        loading={isLoading}
        htmlType="submit"
      >
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;
