import { Button, Drawer, Form, Input, Space } from "antd";
import type { CourtDetail } from "../../api/Court";

interface CreateCourtProps {
  open: boolean;
  onClose: () => void;
  submitHandler: (courtDetails: CourtDetail) => void;
  isLoading: boolean;
}

const CreateCourt: React.FC<CreateCourtProps> = ({
  open,
  onClose,
  submitHandler,
  isLoading,
}) => {
  const [form] = Form.useForm();
  return (
    <>
      <Drawer
        title="Create a court"
        width={450}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              // onClick={onClose}
              type="primary"
              loading={isLoading}
              htmlType="submit"
              form="create-court-form"
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form
          layout="vertical"
          id="create-court-form"
          onFinish={(courtDetail) => {
            form.resetFields();
            submitHandler(courtDetail);
          }}
        >
          <Form.Item
            name="court-name"
            label="Court Name"
            rules={[{ required: true, message: "Please enter court name" }]}
          >
            <Input placeholder="Please enter court name" />
          </Form.Item>
          <Form.Item
            name="location"
            label="Court Location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input placeholder="Please enter court location" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "please tell us ",
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Kindly provide a brief overview of the court"
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default CreateCourt;
