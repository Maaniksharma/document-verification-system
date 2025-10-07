import {
  Button,
  Drawer,
  Form,
  Input,
  Space,
  Upload,
  message,
  Typography,
} from "antd";
import type { UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

interface CreateDocReqProps {
  open: boolean;
  onClose: () => void;
  submitHandler: (newDocRequestData: FormData) => Promise<void>;
  isLoading: boolean;
}

const CreateDocReq: React.FC<CreateDocReqProps> = ({
  open,
  onClose,
  submitHandler,
  isLoading,
}) => {
  const [form] = Form.useForm();
  const { Paragraph } = Typography;
  const [file, setFile] = useState<Blob | null>(null); // state to hold file

  const handleBeforeUpload = (file: Blob) => {
    setFile(file);
    return false;
  };

  const props: UploadProps = {
    accept: ".doc,.docx,.txt",
    beforeUpload: handleBeforeUpload,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  async function handleSubmit(values: any) {
    if (!file) {
      alert("Please upload a file");
      return;
    }

    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("template", file);
    try {
      await submitHandler(formData);
      form.resetFields();
    } catch {
      form.resetFields();
    }
  }
  return (
    <>
      <Drawer
        title="Request Document Verification"
        width={500}
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
          onFinish={(newDocReqDetail) => {
            form.resetFields();
            handleSubmit(newDocReqDetail);
          }}
        >
          <Form.Item
            name="name"
            label="Document Request Name"
            rules={[{ required: true, message: "Please enter court name" }]}
          >
            <Input placeholder="Please enter document request Name" />
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
          <Form.Item
            name="template"
            label="Upload template"
            rules={[{ required: true, message: "Please upload the template" }]}
          >
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
        <Form.Item>
          <Paragraph type="secondary">
            <strong>Note:</strong> <br />
            The template must include placeholders:
            <code>{"{Case Id}"}</code>, <code>{"{Address}"}</code>,{" "}
            <code>{"{Signature}"}</code>,<code>{"{Delegation Message}"}</code>,
            and <code>{"{QR Code}"}</code>. <br />
            Placeholders <code>{"{Court}"}</code> and{" "}
            <code>{"{Reference Number}"}</code> are optional. <br />
            If any required placeholder is missing, the template will be
            considered invalid. For more info, please check the documentation.
          </Paragraph>
        </Form.Item>
        <Form.Item>
          <Paragraph>
            Need a sample?{" "}
            <Button type="link" className="px-[4px]!">
              <a
                href="http://localhost:3000/sample_template.docx"
                download={true}
              >
                Download Here
              </a>
            </Button>
          </Paragraph>
        </Form.Item>
      </Drawer>
    </>
  );
};

export default CreateDocReq;
