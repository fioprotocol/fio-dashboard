import { useCallback } from 'react';

import useEffectOnce from './general';

export function useGTMGlobalTags(): void {
  const GOOGLE_TAG_MANAGER_ID = process.env.REACT_APP_IS_WRAP_STATUS_PAGE
    ? process.env.REACT_APP_WRAP_GOOGLE_TAG_MANAGER_ID
    : process.env.REACT_APP_GOOGLE_TAG_MANAGER_ID;

  const addGTMGlobalTags = useCallback(() => {
    if (!GOOGLE_TAG_MANAGER_ID) {
      return;
    }
    const script = document.createElement('script');
    script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.defer=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GOOGLE_TAG_MANAGER_ID}');`;
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}`;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.cssText = 'display:none;visibility:hidden';
    noscript.appendChild(iframe);

    document.head.append(
      document.createComment(' Google Tag Manager '),
      script,
      document.createComment(' End Google Tag Manager '),
    );
    document.body.prepend(
      document.createComment(' Google Tag Manager (noscript) '),
      noscript,
      document.createComment(' End Google Tag Manager (noscript) '),
    );
  }, [GOOGLE_TAG_MANAGER_ID]);

  useEffectOnce(() => {
    addGTMGlobalTags();
  }, [addGTMGlobalTags]);
}
