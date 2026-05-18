import toast from 'react-hot-toast';

export const shareOrCopy = async ({ title, text, url, tr }) => {
  const fullUrl = url || window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url: fullUrl });
      return;
    } catch {
      // User cancelled — fall through to copy.
    }
  }
  try {
    await navigator.clipboard.writeText(fullUrl);
    toast.success(tr ? tr('link_copied') : 'Link copied');
  } catch {
    toast(fullUrl, { duration: 4000 });
  }
};
