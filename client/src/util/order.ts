import { getPagePrintScreenDimensions } from '../util/screen';

const getFontFamilyStylesString = () => {
  const stylesheets = document.styleSheets;

  // Initialize a string to store the @font-face rules for specific font families
  let fontFaceRulesString = '';

  // Define the font families you want to copy
  const fontFamiliesToCopy = [
    'Proxima Nova Thin',
    'Proxima Nova Semibold',
    'Proxima Nova Regular',
  ];

  // Loop through the stylesheets
  for (let i = 0; i < stylesheets.length; i++) {
    const stylesheet = stylesheets[i];

    // Check if the stylesheet has rules (ignoring cross-origin stylesheets for security reasons)
    if (stylesheet.cssRules) {
      // Loop through the CSS rules in the stylesheet
      for (let j = 0; j < stylesheet.cssRules.length; j++) {
        const rule = stylesheet.cssRules[j];

        // Check if the rule is an @font-face rule (CSSFontFaceRule)
        if (rule.type === CSSRule.FONT_FACE_RULE) {
          // Cast the rule to CSSFontFaceRule to access its CSS text
          const fontFaceRule = rule as CSSFontFaceRule;

          // Check if the font family matches one of the desired font families
          if (
            fontFamiliesToCopy.includes(
              fontFaceRule.style
                .getPropertyValue('font-family')
                .replaceAll('"', ''),
            )
          ) {
            // Access the entire @font-face rule as a string
            const fontFaceRuleString = fontFaceRule.cssText;

            // Concatenate the rule string to the existing fontFaceRulesString
            fontFaceRulesString += fontFaceRuleString;
          }
        }
      }
    }
  }

  return fontFaceRulesString;
};

export const generateOrderHtmlToPrint = ({
  componentHtml,
  orderNumber,
  isPrint,
}: {
  componentHtml: string;
  orderNumber: string;
  isPrint?: boolean;
}): string => {
  const { width, height } = getPagePrintScreenDimensions({ isPrint });

  const fontFaceStyles = isPrint
    ? `<style>${getFontFamilyStylesString()}</style>`
    : '';

  return `
    <!DOCTYPE html>
    <html style="margin:0;width:${width};display:block;height:${height}">
    <head>
    ${fontFaceStyles}
    <style>
      @media print {
        @page {
          size: ${width} ${height};
        }
      }
    </style>
    <title>FIO Dashboard Order - ${orderNumber}</title>
    </head>
    <body style="margin:0;width:${width};display:block;height:${height}">
      ${componentHtml.replaceAll('-word-break', 'word-break')}
    </body>
    </html>
  `;
};
