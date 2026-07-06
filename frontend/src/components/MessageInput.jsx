import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore.js';
import { Image, Send, X } from 'lucide-react';
import { resizeAndCompressImage } from '../lib/imageUtils.js';

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [rawImageFile, setRawImageFile] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();

    const handleImageChange = async(e) =>{
        const file = e.target.files[0];
        if(!file) return;
        if(!file.type.startsWith("image/")){
            toast.error("Please select an image file");
            return;
        }

        try {
            const compressedDataUrl = await resizeAndCompressImage(file, 1024, 0.78);
            setImagePreview(compressedDataUrl);
            setRawImageFile(file);
        } catch (error) {
            console.error("Image processing failed:", error);
            toast.error("Unable to process the selected image. Please try a different file.");
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setRawImageFile(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async(e) =>{
        e.preventDefault();
        if(!text.trim() && !imagePreview) return;

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });
            
            // Clear the form
            setText("");
            setImagePreview(null);
            setRawImageFile(null);
            if(fileInputRef.current) fileInputRef.current.value = "";

        } catch (error) {
            console.error("Failed to send message: ", error);
        }
    };

  return (
    <div className='p-4 w-full'>
      {imagePreview && (
        <div className='mb-3 flex items-center gap-2'>
          <div className='relative'>
            <img 
              src={imagePreview}
              alt='Preview'
              className='w-20 h-20 object-cover rounded-lg border border-zinc-700'
              />
             <button onClick={removeImage} className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center' type="button">
                <X className='size-3'/>
             </button>
          </div>

        </div>

      )}

      <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
        <div className="flex-1 flex gap-2">
            <textarea className="w-full textarea textarea-bordered rounded-lg input-sm sm:input-md resize-none leading-tight py-2 min-h-0 h-10 overflow-hidden"
              placeholder="Type a message..."
              value={text} onChange={(e)=> setText(e.target.value)} 
              rows={1}   
              onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      handleSendMessage(e);
                    }
                  }}
              onInput={(e) => {
                e.target.style.height = "40px";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
           
             <input
                type="file"
                accept="image/*"
                className='hidden'
                ref = {fileInputRef}
                onChange={handleImageChange}
             />

             <button 
               type="button"
               className={`sm:flex btn btn-circle
                  ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                onClick={()=>fileInputRef.current?.click()}
             >
               <Image size={20} />
             </button>

        </div>

        <button type='submit'
        className='btn btn-sm btn-circle'
        disabled={!text.trim() && !imagePreview}
        >

          <Send size={22} />
        </button>

      </form>

    </div>
  )
}

export default MessageInput