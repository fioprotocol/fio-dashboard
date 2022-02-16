import { DEFAULT_TEXT_TRUNCATE_LENGTH } from '../constants/common';

export async function copyToClipboard(text: string) {
  // mobile workaround because mobile devices don't have clipboard object in navigator
  function copyToMobileClipboard(str: string) {
    const el = document.createElement('textarea');
    el.value = str;
    // @ts-ignore
    el.style = { position: 'absolute', left: '-9999px' };
    el.setAttribute('readonly', '');
    document.body.appendChild(el);

    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      // save current contentEditable/readOnly status
      const editable = el.contentEditable;
      const readOnly = el.readOnly;

      // convert to editable with readonly to stop iOS keyboard opening
      // @ts-ignore
      el.contentEditable = true;
      el.readOnly = true;

      // create a selectable range
      const range = document.createRange();
      range.selectNodeContents(el);

      // select the range
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      el.setSelectionRange(0, 999999);

      // restore contentEditable/readOnly to original state
      el.contentEditable = editable;
      el.readOnly = readOnly;
    } else {
      el.select();
    }

    document.execCommand('copy');
    document.body.removeChild(el);
  }
  try {
    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(
      window.navigator.appVersion,
    );
    if (!isMobileDevice) return await navigator.clipboard.writeText(text);
    return await copyToMobileClipboard(text);
  } catch (e) {
    console.error(e);
  }
}

export const getHash = async (itemToHash: File) => {
  if (!(itemToHash instanceof Blob)) return;
  const arrayBuffer = await itemToHash.arrayBuffer();
  const msgUint8 = new Uint8Array(arrayBuffer);

  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hash;
};

const checkNativeShare = () => {
  try {
    return !!navigator.share;
  } catch (e) {
    return false;
  }
};

export const nativeShareIsAvailable = checkNativeShare();
export const shareData = (data: { url?: string; text?: string }) => {
  try {
    navigator.share(data);
  } catch (e) {
    //
  }
};

export const commonFormatTime = (date: string) => {
  if (!date) return 'N/A';
  const activationDay = (dateString: string) =>
    new Date(dateString).toLocaleDateString([], {
      year: 'numeric',
      month: '2-digit',
      day: 'numeric',
    });
  const activationTime = (dateString: string) =>
    new Date(dateString).toLocaleString([], {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  return `${activationDay(date)} @ ${activationTime(date)}`;
};

export const getValueFromPaste = async () => {
  if (!navigator.clipboard.readText) return;

  const clipboardStr = await navigator.clipboard.readText();

  return clipboardStr.trim();
};

// Normalize date if not exists "Z" parameter
export const getUTCDate = (dateString: string) => {
  const date = new Date(dateString);

  return Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  );
};

export const truncateTextInMiddle = (
  text: string,
  startChar: number = DEFAULT_TEXT_TRUNCATE_LENGTH,
  endChar: number = DEFAULT_TEXT_TRUNCATE_LENGTH,
) => {
  if (
    text.length < startChar ||
    text.length < endChar ||
    (text.length - endChar < endChar + 1 &&
      text.length - startChar < startChar + 1)
  )
    return text;
  const start = text.substring(0, startChar);
  const end = text.substring(text.length - endChar, text.length);

  return start + '...' + end;
};
