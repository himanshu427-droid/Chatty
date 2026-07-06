export function resizeAndCompressImage(file, maxWidth = 1024, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Image compression failed'));
            }
            const reader2 = new FileReader();
            reader2.onloadend = () => resolve(reader2.result);
            reader2.onerror = reject;
            reader2.readAsDataURL(blob);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Invalid image file'));
      img.src = reader.result;
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
