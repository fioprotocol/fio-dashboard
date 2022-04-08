import { DEFAULT_TEXT_TRUNCATE_LENGTH } from '../constants/common';

export const log = {
  error: (e: Error | string, e2?: Error | string): void => {
    // eslint-disable-next-line no-console
    if (!e2) console.error(e);
    // eslint-disable-next-line no-console
    if (e2) console.error(e, e2);
  },
};

export async function copyToClipboard(text: string): Promise<void> {
  // mobile workaround because mobile devices don't have clipboard object in navigator
  function copyToMobileClipboard(str: string): void {
    const el = document.createElement('textarea');
    el.value = str;
    // @ts-ignore
    el.style = { position: 'absolute', left: '-9999px' };
    el.setAttribute('readonly', '');
    document.body.appendChild(el);

    if (/ipad|ipod|iphone/i.exec(navigator.userAgent)) {
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
      selection?.removeAllRanges();
      selection?.addRange(range);
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

    return copyToMobileClipboard(text);
  } catch (e) {
    log.error(e);
  }
}

export const getHash = async (itemToHash: File): Promise<string> => {
  if (!(itemToHash instanceof Blob)) return;
  const arrayBuffer = await itemToHash.arrayBuffer();
  const msgUint8 = new Uint8Array(arrayBuffer);

  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const checkNativeShare = (): boolean => {
  try {
    return !!navigator.share;
  } catch (e) {
    return false;
  }
};

export const nativeShareIsAvailable = checkNativeShare();
export const shareData = (data: { url?: string; text?: string }): void => {
  try {
    navigator.share(data);
  } catch (e) {
    //
  }
};

export const commonFormatTime = (date: string): string => {
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

export const getValueFromPaste = async (): Promise<string | undefined> => {
  if (!navigator.clipboard.readText) return;

  const clipboardStr = await navigator.clipboard.readText();

  return clipboardStr.trim();
};

// Normalize date if not exists "Z" parameter
export const getUTCDate = (dateString: string): number => {
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
): string => {
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
