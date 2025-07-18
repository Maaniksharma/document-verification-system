import { Form, Select, Input } from "antd";
import type { FormInstance } from "antd/es/form";

const CreateMemberForm: React.FC<{ form: FormInstance }> = ({ form }) => {
  return (
    <Form layout="vertical" className="py-[20px]!" form={form}>
      <Form.Item
        label="Select role"
        name="role"
        rules={[{ required: true, message: "Please select role" }]}
      >
        <Select>
          <Select.Option value="reader">Reader</Select.Option>
          <Select.Option value="officer">Officer</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Please enter email" }]}
      >
        <Input placeholder="Please enter email" />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please enter password" }]}
      >
        <Input placeholder="Please enter password" type="password" />
      </Form.Item>
    </Form>
  );
};

export default CreateMemberForm;
