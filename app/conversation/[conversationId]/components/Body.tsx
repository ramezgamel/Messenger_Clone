"use client";

import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}
const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();
    const messageHandler = (message: FullMessageType) => {
      setMessages((curr) => {
        if (find(curr, { id: message.id })) return curr;
        return [...messages, message];
      });
      bottomRef?.current?.scrollIntoView();
    };
    const updatedMessageHandler = (newMessage: FullMessageType) => {
      setMessages(curr => curr.map(message => {
        if(message.id == newMessage.id) return newMessage
        return message
      }))
    };
    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updatedMessageHandler);
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updatedMessageHandler);
    };
  }, [conversationId]);
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          key={message.id}
          isLast={i == messages.length - 1}
          data={message}
        />
      ))}
      <div className="pt-24" ref={bottomRef}></div>
    </div>
  );
};

export default Body;
