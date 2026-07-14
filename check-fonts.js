const fetch = require('node-fetch');

(async () => {
  try {
    const res = await fetch('https://objectandarchive.com/');
    const text = await res.text();
    
    const fontMatches = text.match(/font-family[^;>\}]+/gi);
    if (fontMatches) {
      console.log('Font mentions:', [...new Set(fontMatches)]);
    }
    
    const fontLinks = text.match(/<link[^>]+fonts[^>]+>/gi);
    if (fontLinks) {
      console.log('Font Links:', fontLinks);
    }

    const typekit = text.match(/use\.typekit\.net\/[^\.]+\.css/gi);
    if (typekit) {
      console.log('Typekit:', typekit);
    }
    
  } catch (e) {
    console.error(e);
  }
})();
