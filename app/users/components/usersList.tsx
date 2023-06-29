"use client";
import { User } from "@prisma/client";
import React from "react";
import UserBox from "./userBox";

interface UsersListProps {
  users: User[];
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
  return (
    <aside
      className="
        fixed
        inset-y-0
        pb-20
        lg:pb-0
        lg:left-20
        lg:w-80
        overflow-y-auto
        border-r
        border-gray-200
        block
        w-full
        left-0
        lg:block
      "
    >
      <div className="px-5">
        <div className="flex-c">
          <div
            className="
              text-2x
              font-bold
              text-neutral-800
              py-4
          "
          >
            People
          </div>
        </div>
        {users.map((user) => 
          <UserBox key={user.id} user={user}/>
        )}
      </div>
    </aside>
    // <div>
    //
    // </div>
  );
};
export default UsersList;
