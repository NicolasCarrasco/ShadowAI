chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'capture_tab') {
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
            sendResponse({ image: dataUrl });
        });
        return true;
    }

    if (request.action === 'open_sidepanel') {
        chrome.sidePanel.open({ tabId: sender.tab.id }).catch(err => {
            console.log("Sidepanel open error:", err);
        });
    }

    if (request.action === 'improve_selection') {
        chrome.storage.local.set({
            pending_prompt: `Mejora la redacción del siguiente texto, mantén el idioma original:\n\n"${request.text}"`
        }, () => {
            chrome.sidePanel.open({ tabId: sender.tab.id }).catch(err => {
                console.log("Sidepanel auto-open logic.");
            });
        });
    }

    if (request.action === 'execute_custom') {
        // 1. Try to send message directly if sidepanel is already open
        chrome.runtime.sendMessage({
            action: 'execute_custom',
            title: request.title,
            context: request.context,
            text: request.text
        }).catch(() => {
            // 2. Fallback: sidepanel not open, use pending_prompt logic
            const combinedPrompt = request.context.includes("{{input}}")
                ? request.context.replace("{{input}}", request.text)
                : `${request.context}\n\nTEXTO A PROCESAR:\n"${request.text}"`;

            chrome.storage.local.set({ pending_prompt: combinedPrompt }, () => {
                chrome.sidePanel.open({ tabId: sender.tab.id }).catch(e => console.log("Sidepanel open error"));
            });
        });
    }
});

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
