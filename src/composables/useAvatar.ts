// export function useAvatar() {
//   /**
//    * Generate a base64 text avatar
//    * @param text - name or string
//    * @param size - image size in px
//    * @param bgColor - background color
//    * @param textColor - text color
//    * @returns base64 image string
//    */
//   function textToImage(
//     text: string,
//     size = 100,
//     bgColor = '#4f46e5', // Tailwind indigo-600
//     textColor = '#ffffff'
//   ): string {
//     const canvas = document.createElement('canvas');
//     canvas.width = size;
//     canvas.height = size;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return '';

//     // Draw background
//     ctx.fillStyle = bgColor;
//     ctx.fillRect(0, 0, size, size);

//     // Draw text (first letter, uppercase)
//     ctx.fillStyle = textColor;
//     ctx.font = `${size / 2}px sans-serif`;
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     ctx.fillText(text.charAt(0).toUpperCase(), size / 2, size / 2);

//     return canvas.toDataURL('image/png');
//   }

//   return { textToImage };
// }

export function useAvatar() {
  function initials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  function color(name: string): string {
    // Create hash from name
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Generate strong vivid color
    const hue = hash % 360 // Different color per name
    return `hsl(${hue}, 85%, 45%)`
    // 85% saturation = very strong color
    // 45% lightness = darker, more bold
  }

  function textToImage(name: string, size = 100): string {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    // Background
    ctx.fillStyle = color(name)
    ctx.fillRect(0, 0, size, size)

    // Text
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${size / 2}px sans-serif` // Bold text
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(initials(name), size / 2, size / 2)

    return canvas.toDataURL('image/png')
  }

  return { initials, color, textToImage }
}
