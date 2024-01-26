import Image from "next/image";

interface HardwareItemCardProps {
  itemTitle: string;
  quantity: number;
  description: string;
  profilePic: string;
}

const HardwareItemCard: React.FC<HardwareItemCardProps> = ({
  itemTitle,
  quantity,
  description,
  profilePic,
}) => {
  return (
    <div className="flex flex-col">
      <Image src={profilePic} height={80} width={80} alt={itemTitle} />
      <div>
        <div>{itemTitle}</div>
        <div>Quantity: {quantity}</div>
      </div>
      <div>{description}</div>
      <div>
        <textarea className="w-2/3" placeholder="Enter your request"></textarea>
        <button className="w-1/3">Request</button>
      </div>
    </div>
  );
};

export default HardwareItemCard;
