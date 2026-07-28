import {create} from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore} from "./useAuthStore.js";

export const useChatStore = create((set, get)=>({
    messages: [],
    users: [],
    isUsersLoading: false,
    isMessagesLoading: false,
    selectedUser: null,

    getUsers: async()=>{
        set({isUsersLoading: true});
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users: res.data});
        } catch (error) {
            toast.error(error.response.data.message)
        } finally{
            set({isUsersLoading : false});
        }
    },

    getMessages: async(userId)=>{
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally{
            set({isMessagesLoading: false});
        }
    },
    
    sendMessage: async(messageData) =>{
        const { selectedUser, messages} = get()
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    deleteMessage: async(messageId) => {
        try {
            const res = await axiosInstance.delete(`/messages/${messageId}`);
            set({
                messages: get().messages.map((message) =>
                    message._id === messageId ? res.data : message
                ),
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete message");
        }
    },

    subscribeToMessages: ()=>{
        const {selectedUser} = get();
        if(!selectedUser) return ;

        const socket = useAuthStore.getState().socket;
        if(!socket) return;

        socket.off("newMessage");
        socket.off("messageDeleted");

        socket.on("newMessage", (newMessage) =>{
            if(newMessage.senderId !== selectedUser._id)  return ;

            set({
                messages: [...get().messages, newMessage],
            });
        });

        socket.on("messageDeleted", ({ message }) => {
            const updatedMessages = get().messages.map((item) =>
                item._id === message._id ? message : item
            );
            set({ messages: updatedMessages });

            // Also silently re-fetch to ensure both sides are in sync
            // This handles cases where the socket event might not fully propagate
            axiosInstance
                .get(`/messages/${selectedUser._id}`)
                .then((res) => {
                    set({ messages: res.data });
                })
                .catch((err) => {
                    console.error("Failed to sync deleted messages:", err);
                });
        });
    },

    unsubscribeFromMessages : ()=>{
        const socket = useAuthStore.getState().socket;
        if(!socket) return;
        socket.off("newMessage");
        socket.off("messageDeleted");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    


}));