import { Card, Image, Skeleton } from "antd";
import { formatTimestamp } from "../../utils/generic";

const { Meta } = Card;

interface SignaturePathProps {
  signaturePath: string;
  uploadedDate: Date;
}

const SignatureCard: React.FC<SignaturePathProps> = ({
  signaturePath,
  uploadedDate,
}) => {
  return (
    <Card
      hoverable
      className="w-[320px] object-cover"
      cover={
        <Image
          width={320}
          alt="example"
          src={import.meta.env.VITE_backend_url + "/" + signaturePath}
          placeholder={<Skeleton.Image active />}
        />
      }
    >
      <Meta title={formatTimestamp(uploadedDate)} />
    </Card>
  );
};

export default SignatureCard;
