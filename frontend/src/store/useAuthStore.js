import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";


export const useAuthStore = create((set, get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers: [],
    socket: null,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data})
            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth:" , error);
            set({authUser:null})
        } 
        finally{
            set({isCheckingAuth:false});
        }
    },

    signup: async(data)=>{
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});
            toast.success("Account created successfully");
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
            
        } finally{
            set({ isSigningUp: false});
        }
    },

    logout : async() => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged Out Successfully");

            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);

        }
    },

    login: async(data) => {
        set({isLoggingIn:true});
        try {
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser: res.data});
            toast.success("Account logged in successfully");

            get().connectSocket()

        } catch (error) {
            toast.error(error.response.data.message);
        }
        finally{
            set({isLoggingIn: false});
        }
    },

    loginWithGoogle : async(idToken) => {
        try {
            const res = await axiosInstance.post("/auth/google-login", {idToken,});
            set({authUser: res.data});
            toast.success("Logged in with Gmail successfully!");
            get().connectSocket();
        } catch (error) {
            console.error("Failed Gmail login")
            toast.error(error.response?.data?.message || "Gmail login failed")
            
        }
        finally{
            set({isLoggingIn: false})
        }
    },

    updateProfile: async(data)=>{
        set({isUpdatingProfile: true});
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({authUser: res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);

        } finally{
            set({isUpdatingProfile: false});
        }
    },

    connectSocket : ()=>{
        const {authUser} = get()
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            // send userId in auth payload (more reliable than query in production)
            auth: {
                userId: authUser._id,
            },
            transports: ["websocket", "polling"],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        set({ socket });

        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });

        socket.on("connect_error", (err) => {
            console.warn("Socket connect_error:", err.message || err);
        });

        socket.on("reconnect_attempt", (attempt) => {
            console.log("Socket reconnect attempt", attempt);
        });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: Array.isArray(userIds) ? userIds : [] });
        });
    },
    
    disconnectSocket : ()=>{
        if(get().socket?.connected) get().socket.disconnect();
    },
    




}));