const getChatBubbleStyles = (theme) => {
    switch (theme) {
      case "light":
        return "bg-white text-gray-800 border border-gray-300"; // Light theme - white background with dark text
      case "dark":
        return "bg-gray-900 text-gray-100 border border-gray-700"; // Dark theme - dark background with light text
      case "bumblebee":
        return "bg-yellow-500 text-gray-900 border border-yellow-600"; // Bumblebee theme - vibrant yellow with dark text
      case "cupcake":
        return "bg-pink-200 text-gray-800 border border-pink-300"; // Cupcake theme - soft pink background
      case "cyberpunk":
        return "bg-purple-900 text-neon-yellow border border-purple-700"; // Cyberpunk theme - neon colors
      case "emerald":
        return "bg-green-500 text-white border border-green-600"; // Emerald theme - strong green with white text
      case "synthwave":
        return "bg-purple-800 text-pink-400 border border-pink-600"; // Synthwave theme - purple and pink
      case "retro":
        return "bg-orange-400 text-black border border-orange-500"; // Retro theme - orange background
      case "corporate":
        return "bg-blue-600 text-white border border-blue-700"; // Corporate theme - blue with white text
      case "valentine":
        return "bg-red-400 text-white border border-red-500"; // Valentine theme - red background with white text
      case "garden":
        return "bg-green-200 text-gray-900 border border-green-300"; // Garden theme - light green
      case "forest":
        return "bg-green-800 text-gray-100 border border-green-900"; // Forest theme - dark green
      case "aqua":
        return "bg-cyan-500 text-white border border-cyan-600"; // Aqua theme - bright cyan
      case "lofi":
        return "bg-gray-200 text-gray-800 border border-gray-300"; // Lofi theme - minimal gray
      case "pastel":
        return "bg-pink-100 text-gray-900 border border-pink-200"; // Pastel theme - soft pastel pink
      case "fantasy":
        return "bg-purple-300 text-gray-900 border border-purple-400"; // Fantasy theme - light purple
      case "black":
        return "bg-black text-white border border-gray-900"; // Black theme - black background with white text
      case "luxury":
        return "bg-gray-800 text-gold-400 border border-gray-900"; // Luxury theme - elegant dark with gold
      case "dracula":
        return "bg-red-700 text-gray-100 border border-red-800"; // Dracula theme - deep red
      case "halloween":
        return "bg-orange-600 text-black border border-orange-700"; // Halloween theme - bold orange
      case "autumn":
        return "bg-orange-300 text-gray-800 border border-orange-400"; // Autumn theme - muted orange
      case "coffee":
        return "bg-brown-700 text-cream-200 border border-brown-800"; // Coffee theme - rich brown with cream text
      case "winter":
        return "bg-blue-200 text-gray-900 border border-blue-300"; // Winter theme - frosty blue
      default:
        return "bg-gray-200 text-black border border-gray-300"; // Default style
    }
  };

  
export default getChatBubbleStyles;