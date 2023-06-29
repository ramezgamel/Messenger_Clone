import Model from "@/app/components/Model";
import Image from "next/image";
import React from "react";
interface ImageModelProps {
  src?: string | null;
  isOpen?: boolean;
  onClose: () => void;
}
const ImageModel: React.FC<ImageModelProps> = ({ src, isOpen, onClose }) => {
  if (!src) return null;
  return (
    <Model isOpen={isOpen} onClose={onClose}>
      <div className="w-80 h-80">
        <Image alt="Image" src={src} fill />
      </div>
    </Model>
  );
};

export default ImageModel;
