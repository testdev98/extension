
async function fetchNiftyData() {
    try {
        const response = await fetch('https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
            }
        });
        const data = await response.json();
        const niftyData = {
            price: data.data[0].lastPrice,
            open: data.data[0].open,
            high: data.data[0].dayHigh,
            low: data.data[0].dayLow,
            close: data.data[0].previousClose,
        };
        chrome.storage.local.set({ niftyData });
    } catch (error) {
        console.error('Error fetching Nifty 50 data:', error);
    }
}

fetchNiftyData();
setInterval(fetchNiftyData, 2000);
