import { User } from "@prisma/client";
import Image from "next/image";
import React from "react";

const AvatarGroup = ({ users = [] }: { users: User[] }) => {
  const slicedUsers = users.slice(0, 3);
  const positionMap = {
    0: "top-0 left-[12px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };
  return (
    <div className="h-11 w-11 relative">
      {slicedUsers.map((user, i) => (
        <div
          key={user.id}
          className={`
        absolute inline-block rounded-full overflow-hidden h-[21px] w-[21px] 
        ${positionMap[i as keyof typeof positionMap]}
      `}
        >
          <Image alt="Avatar" fill src={user?.image || "/images/avatar.jpg"} />
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
