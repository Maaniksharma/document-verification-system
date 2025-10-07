import { Spin } from "antd";
import SignatureCard from "./SignatureCard";
import { useEffect, useState } from "react";
import { fetchSignatures } from "../../api/officer";
import { useParams } from "react-router-dom";

interface Signatures {
  path: string;
  createdAt: Date;
}

const Signatures: React.FC = () => {
  const [signatures, setSignatures] = useState<Signatures[]>();
  const params = useParams();

  async function getSignatures() {
    const { signatures } = await fetchSignatures(params.id as string);

    if (signatures) {
      setSignatures(signatures);
    }
  }

  useEffect(() => {
    getSignatures();
  }, []);

  if (!signatures) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!params.id) {
    return <div className="">Some error occured</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-[60px]">
      {signatures.map((signature) => (
        <SignatureCard
          key={signature.path}
          signaturePath={signature.path}
          uploadedDate={signature.createdAt}
        />
      ))}
    </div>
  );
};

export default Signatures;
