import { Button } from "antd";
import { useState } from "react";
import UploadSignatureModal from "../components/officer/UploadSignatureModal";
import Signatures from "../components/officer/Signatures";

const SignaturePage = () => {
  const [triggerModal, setTriggerModal] = useState(true);
  return (
    <div className="flex flex-col gap-[40px]">
      <div className="py-[40px] flex flex-col gap-[24px]">
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">Your Signatures</div>
          <Button
            type="primary"
            onClick={() => {
              setTriggerModal((current) => !current);
            }}
          >
            Upload a Signature
          </Button>
        </div>
        <Signatures />
      </div>
      <UploadSignatureModal triggerOpen={triggerModal} />
    </div>
  );
};

export default SignaturePage;
