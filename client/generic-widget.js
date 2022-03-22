/* eslint-disable no-unused-vars */

function loadJsFile(jsFiles) {
  const src = document.createElement('script');
  src.setAttribute('type', 'text/javascript');
  src.setAttribute('src', jsFiles);
  document.getElementsByTagName('body')[0].appendChild(src);
}

function loadCssFile(cssFiles) {
  const link = document.createElement('link');
  link.setAttribute('href', cssFiles);
  link.setAttribute('rel', 'stylesheet');
  document.getElementsByTagName('head')[0].appendChild(link);
}
