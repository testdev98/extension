
const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';

async function hasOffscreenDocument() {
    return await chrome.offscreen.hasDocument();
}

async function setupOffscreenDocument() {
    if (await hasOffscreenDocument()) {
        return;
    }
    await chrome.offscreen.createDocument({
        url: OFFSCREEN_DOCUMENT_PATH,
        reasons: ['DOM_PARSER'],
        justification: 'To parse HTML from nseindia.com',
    });
}

async function closeOffscreenDocument() {
    if (await hasOffscreenDocument()) {
        await chrome.offscreen.closeDocument();
    }
}

async function fetchNiftyData() {
    try {
        await setupOffscreenDocument();

        const response = await fetch('https://www.nseindia.com/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
            }
        });
        const html = await response.text();

        const niftyData = await chrome.runtime.sendMessage({
            type: 'parse-html',
            target: 'offscreen',
            html: html
        });

        if (niftyData) {
            chrome.storage.local.set({ niftyData });
        }
    } catch (error) {
        console.error('Error fetching Nifty 50 data:', error);
    }
}

// Set up the offscreen document when the extension starts
chrome.runtime.onstartup.addListener(setupOffscreenDocument);

// Run the fetch and parse logic
fetchNiftyData();
setInterval(fetchNiftyData, 2000);