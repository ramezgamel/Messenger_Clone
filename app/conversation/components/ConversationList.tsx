"use client";
import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModel from "./GroupChatModel";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
}
const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const [items, setItems] = useState(initialItems);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const session = useSession();
  const router = useRouter();
  const { conversationId, isOpen } = useConversation();
  const pusherKey = useMemo(
    () => session?.data?.user?.email,
    [session?.data?.user?.email]
  );
  useEffect(() => {
    if (!pusherKey) return;
    pusherClient.subscribe(pusherKey);
    const newConversationHandler = (newConversation: FullConversationType) => {
      setItems((currConversations) => {
        if (find(currConversations, { id: newConversation.id }))
          return currConversations;
        return [newConversation, ...currConversations];
      });
    };
    const updateConversationHandler = (
      UpdatedConversation: FullConversationType
    ) => {
      setItems((currConversations) =>
        currConversations.map((curr) => {
          if (curr.id == UpdatedConversation.id)
            return { ...curr, messages: UpdatedConversation.messages };
          return curr;
        })
      );
    };
    const deleteConversationHandler = (
      deletedConversation: FullConversationType
    ) => {
      setItems((currConversations) => [
        ...currConversations.filter((curr) => {
          curr.id != deletedConversation.id;
        }),
      ]);
      if (conversationId == deletedConversation.id)
        router.push("/conversation");
    };
    pusherClient.bind("conversation:delete", deleteConversationHandler);
    pusherClient.bind("conversation:new", newConversationHandler);
    pusherClient.bind("conversation:update", updateConversationHandler);
    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newConversationHandler);
      pusherClient.unbind("conversation:update", updateConversationHandler);
      pusherClient.unbind("conversation:update", updateConversationHandler);
    };
  }, [pusherKey, conversationId, router]);
  return (
    <>
      <GroupChatModel
        users={users}
        isOpen={isModelOpen}
        onClose={() => setIsModelOpen(false)}
      />
      <aside
        className={clsx(
          `
        fixed
        inset-y-0
        pb-20
        lg:pb-0
        lg:left-20
        lg:w-80
        lg:block
        overflow-y-auto
        border-r
        border-gray-200
      `,
          isOpen ? "hidden" : "block w-full left-0 "
        )}
      >
        <div className="px-5 py-3">
          <div className="flex justify-between mb-4 pt">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setIsModelOpen(true)}
              className="
            rounded-full
            p-2
            bg-gray-100
            text-gray-600
            cursor-pointer
            hover:opacity-75
            transition
          "
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          <div>
            {items.map((item: FullConversationType) => (
              <ConversationBox
                key={item.id}
                data={item}
                selected={conversationId == item.id}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};
export default ConversationList;
