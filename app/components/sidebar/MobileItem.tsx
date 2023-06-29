import Link from "next/link";
import React from "react";
import clsx from "clsx";
interface MobileItemProps {
  href: string;
  icon: any;
  onClick?: () => void;
  active?: boolean | string;
}
const MobileItem: React.FC<MobileItemProps> = ({
  href,
  active,
  icon: Icon,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) return onClick();
  };
  return (
    <Link
      passHref
      href={href}
      onClick={handleClick}
      className={clsx(
        `
        group
        flex
        gap-x-3
        text-sm
        leading-6
        font-semibold
        w-full
        justify-center
        p-4
        text-gray-500
        hover:text-black
        hover:bg-gray-100`,
        active && "bg-gray-100 text-black"
      )}
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
};

export default MobileItem;
