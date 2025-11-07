
chrome.runtime.onMessage.addListener(handleMessages);

function handleMessages(message, sender, sendResponse) {
  if (message.target !== 'offscreen') {
    return;
  }

  if (message.type === 'parse-html') {
    const data = parseHtml(message.html);
    sendResponse(data);
  }
  return true;
}

function parseHtml(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const priceDiv = doc.querySelector('.symbol_value > div');
  const fullPriceText = priceDiv ? priceDiv.textContent.trim() : 'N/A';

  const open = doc.querySelector('.symbol_open h3')?.textContent.trim() || 'N/A';
  const high = doc.querySelector('.symbol_high h3')?.textContent.trim() || 'N/A';
  const low = doc.querySelector('.symbol_low h3')?.textContent.trim() || 'N/A';

  let close = 'N/A';
  const allIndices = doc.querySelectorAll('.indices_value');
  allIndices.forEach(div => {
      const p = div.querySelector('p');
      if (p && p.textContent.trim().toUpperCase() === 'PREV. CLOSE') {
          const h3 = div.querySelector('h3');
          if (h3) {
              close = h3.textContent.trim();
          }
      }
  });

  return {
    price: fullPriceText.split(' ')[0].replace(/,/g, ''),
    open: open.replace(/,/g, ''),
    high: high.replace(/,/g, ''),
    low: low.replace(/,/g, ''),
    close: close.replace(/,/g, '')
  };
}
