import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
import { Camera, Mail, User, Edit3, Check } from 'lucide-react';

const ProfilePage = () => {
    const {authUser, isUpdatingProfile, updateProfile} = useAuthStore();
    const [selectedImg, setSelectedImg] = useState(null);
    const [fullName, setFullName] = useState(authUser?.fullName || '');
    const [bio, setBio] = useState(authUser?.bio || '');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);

    const handleImageUpload = async(e)=>{
        const file = e.target.files[0];
        if(!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async()=>{
            const base64Image = reader.result;
            setSelectedImg(base64Image);
            await updateProfile({profilePic: base64Image});
        }
    }

    const handleSaveName = async () => {
        await updateProfile({ fullName });
        setIsEditingName(false);
    }

    const handleSaveBio = async () => {
        await updateProfile({ bio });
        setIsEditingBio(false);
    }

   return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Profile</h1>
                <p className="mt-2">Your Profile Information</p>
            </div>
            {/* profile pic upload*/}

            <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="size-4"/>
                        Full Name
                    </div>
                    <button
                        type="button"
                        onClick={() => isEditingName ? handleSaveName() : setIsEditingName(true)}
                        disabled={isUpdatingProfile}
                        className="text-sm flex items-center gap-1 text-primary"
                    >
                        {isEditingName ? <Check className="size-4" /> : <Edit3 className="size-4" />}
                        {isEditingName ? 'Save' : 'Edit'}
                    </button>
                </div>
                {isEditingName ? (
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-base-200 rounded-lg border border-base-300 outline-none"
                        placeholder="Enter your full name"
                    />
                ) : (
                    <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
                )}
            </div>

            <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="size-4"/>
                        Bio
                    </div>
                    <button
                        type="button"
                        onClick={() => isEditingBio ? handleSaveBio() : setIsEditingBio(true)}
                        disabled={isUpdatingProfile}
                        className="text-sm flex items-center gap-1 text-primary"
                    >
                        {isEditingBio ? <Check className="size-4" /> : <Edit3 className="size-4" />}
                        {isEditingBio ? 'Save' : 'Edit'}
                    </button>
                </div>
                {isEditingBio ? (
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows="3"
                        className="w-full px-4 py-2.5 bg-base-200 rounded-lg border border-base-300 outline-none resize-none"
                        placeholder="Write a short about"
                    />
                ) : (
                    <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.bio || 'No bio added'}</p>
                )}
            </div>

            <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <Mail className="size-4"/>
                    Email Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                    <span>Member Since</span>
                    <span>{authUser?.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                    <span>Account Status</span>
                    <span className="text-green-500">Active</span>
                </div>
                
            </div>
          </div>

          


        </div>
      </div>

    </div>
  )
}

export default ProfilePage