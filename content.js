// Notify sidepanel about selection
function sendSelectionToSidepanel(selection) {
    if (selection.length > 0) {
        chrome.runtime.sendMessage({
            action: 'text_selected',
            text: selection
        });
    }
}

document.addEventListener('mouseup', (e) => {
    // Check if the sidepanel IS the active element to avoid loops (though usually not an issue)
    const selection = window.getSelection().toString().trim();
    if (selection.length > 0) {
        sendSelectionToSidepanel(selection);
    }
});

console.log("ShadowAI: Content script active (Silent Mode).");

