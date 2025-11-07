
function updatePopup() {
    chrome.storage.local.get('niftyData', (data) => {
        const niftyData = data.niftyData;
        if (niftyData) {
            document.getElementById('price').textContent = `Price: ${niftyData.price}`;
            document.getElementById('open').textContent = `Open: ${niftyData.open}`;
            document.getElementById('high').textContent = `High: ${niftyData.high}`;
            document.getElementById('low').textContent = `Low: ${niftyData.low}`;
            document.getElementById('close').textContent = `Close: ${niftyData.close}`;
        }
    });
}

document.addEventListener('DOMContentLoaded', updatePopup);
setInterval(updatePopup, 2000);
