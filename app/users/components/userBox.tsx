"use client";
import Avatar from "@/app/components/Avatar";
import LoadingModel from "@/app/components/LoadingModel";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

interface UserBoxProps {
  user: User;
}

const UserBox: React.FC<UserBoxProps> = ({ user }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = useCallback(() => {
    setIsLoading(true);
    axios
      .post("/api/conversations", {
        userId: user.id,
        isGroup: false,
      })
      .then((res) => router.push(`/conversation/${res.data.id}`))
      .finally(() => setIsLoading(false));
  }, [user, router]);
  return (
    <>
      {isLoading && <LoadingModel />}
      <div
        onClick={handleClick}
        className="
          w-full
          relative
          flex
          items-center
          space-x-3
          bg-white
          p-3
          hover:bg-neutral-100
          rounded-lg
          transition
          cursor-pointer
        "
      >
        <Avatar user={user} />
        <div className="min-w-0 flex">
          <div className="focus:outline-none">
            <div
              className="
                flex
                justify-between
                items-center
                mb-1
              "
            >
              <p
                className="
                  text-sm
                  font-medium
                  text-gray-900
                "
              >
                {user.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default UserBox;