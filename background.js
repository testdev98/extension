
async function fetchNiftyData() {
    try {
        const response = await fetch('https://www.nseindia.com/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
            }
        });
        const html = await response.text();
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

        const niftyData = {
            price: fullPriceText.split(' ')[0].replace(/,/g, ''),
            open: open.replace(/,/g, ''),
            high: high.replace(/,/g, ''),
            low: low.replace(/,/g, ''),
            close: close.replace(/,/g, '')
        };

        chrome.storage.local.set({ niftyData });
    } catch (error) {
        console.error('Error fetching Nifty 50 data:', error);
    }
}

fetchNiftyData();
setInterval(fetchNiftyData, 2000);