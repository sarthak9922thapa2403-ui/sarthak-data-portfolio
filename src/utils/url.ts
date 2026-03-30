export const extractUrl = (input: string) => {
  if (!input) return input;
  
  let url = input.trim();

  // Check if it's an iframe or img tag
  const srcMatch = input.match(/src=["'](.*?)["']/);
  if (srcMatch && srcMatch[1]) {
    url = srcMatch[1];
  }
  
  // If it's just a URL
  if (!url.startsWith('#') && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
    url = `https://${url.replace(/^\/+/, '')}`;
  }
  return url;
};
