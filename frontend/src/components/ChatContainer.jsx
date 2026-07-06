import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import MessageInput from "./MessageInput.jsx";
import ChatHeader from "./ChatHeader.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/utils.js";
import { useThemeStore } from "../store/useThemeStore.js";
import getChatBubbleStyles from "../constants/getTheme.jsx";
import { Download, MoreVertical, Trash2 } from "lucide-react";

const ChatContainer = () => {
  const {
    getMessages,
    isMessagesLoading,
    selectedUser,
    messages,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const { theme } = useThemeStore();
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleDeleteMessage = (messageId) => {
    setOpenMenuId(null);
    deleteMessage(messageId);
  };

  const handleDownloadImage = (imageUrl) => {
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.target = "_blank";
    link.download = "chat-image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpenMenuId(null);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            } 
  `}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full-border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div
              style={{ boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.3)' }}
              className={`
              chat-bubble relative group max-w-[80%] rounded-xl p-2.5 shadow-xl
                          ${
                             message.senderId === authUser._id
                              ? "bg-primary text-primary-content"
                              : "bg-base-200"
                          }
                        `}
            >
              {!message.deleted  && (
                <div className="absolute -top-2 -right-2 z-10">
                  {!message.deleted && (message.image || message.senderId === authUser._id) && (
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(openMenuId === message._id ? null : message._id)}
                      className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity rounded-full bg-base-100/80 p-1 shadow-sm"
                    >
                      <MoreVertical className="text-base-content" size={14} />
                    </button>
                  ) }

                  {openMenuId === message._id && (
                    <div className="absolute right-0 mt-1 w-32 rounded-lg border border-base-300 bg-base-100 p-1 shadow-lg">
                      {!message.deleted && message.image && (
                        <button
                          type="button"
                          onClick={() => handleDownloadImage(message.image)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-base-content hover:bg-base-200"
                        >
                          <Download size={14} />
                          Save
                        </button>
                      )}
                      { message.senderId === authUser._id && (
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(message._id)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-500 hover:bg-base-200"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                      )
                      }
                    </div>
                  )}
                </div>
              )}

              {!message.deleted && message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.deleted ? (
                <p className="italic opacity-70">This message was deleted</p>
              ) : (
                message.text && 
                <p className="break-words whitespace-pre-wrap break-all">
                      {message.text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
