// DOM Elements
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const captureBtn = document.getElementById('capture-btn');
const settingsTrigger = document.getElementById('settings-trigger');
const settingsPanel = document.getElementById('settings-panel');
const apiKeyInput = document.getElementById('api-key-input');
const modelSelect = document.getElementById('model-select');
const saveSettingsBtn = document.getElementById('save-settings');
const tokenCountEl = document.getElementById('token-count');
const loadingEl = document.getElementById('loading');
const previewImagesContainer = document.getElementById('preview-images-container');
const clearActualBtn = document.getElementById('clear-chat');
const newChatBtn = document.getElementById('new-chat-btn');
const historyTrigger = document.getElementById('history-trigger');
const historyPanel = document.getElementById('history-panel');
const closeHistoryBtn = document.getElementById('close-history');
const historyList = document.getElementById('history-list');
const mainOverlay = document.getElementById('main-overlay');
const shortcutsBar = document.getElementById('shortcuts-bar');
const addShortcutTrigger = document.getElementById('add-shortcut-trigger');
const customFunctionPanel = document.getElementById('custom-function-panel');
const closeFunctionBtn = document.getElementById('close-function');
const saveFunctionBtn = document.getElementById('save-function');
const fnTitleInput = document.getElementById('fn-title');
const fnContextInput = document.getElementById('fn-context');
const fnModalTitle = document.getElementById('fn-modal-title');
const managedShortcutsList = document.getElementById('managed-shortcuts-list');
const addShortcutSettingsBtn = document.getElementById('add-shortcut-settings');
const fileInput = document.getElementById('file-input');
const attachFileBtn = document.getElementById('attach-file-btn');
const filePreviewContainer = document.getElementById('file-preview-container');
const aboutToggle = document.getElementById('about-toggle');
const aboutContent = document.getElementById('about-content');
const howToggle = document.getElementById('how-toggle');
const howContent = document.getElementById('how-content');
const tokenInfo = document.getElementById('token-info');

// Selection Box Elements
const selectionBox = document.getElementById('selection-box');
const selectionPreview = document.getElementById('selection-text-preview');
const acceptSelectionBtn = document.getElementById('accept-selection');
const ignoreSelectionBtn = document.getElementById('ignore-selection');
const closeSelectionBoxBtn = document.getElementById('close-selection-box');

// State
let currentScreenshots = [];
let totalTokens = 0;
let currentChatMessages = [];
let customFunctions = [];
let history = [];
let currentConversationId = null;
let lastSelectedText = "";
let editingId = null;
let attachedFiles = [];

const DEFAULT_API_KEY = ''; // Configure your API Key in Settings
const DEFAULT_MODEL = 'gemini-2.0-flash-exp';
const CONTEXT_WINDOW_LIMIT = 10;

// Safety limits to protect quota
const MAX_TOTAL_IMAGES = 3; // Max screenshots + clipboard images combined
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB per image
const MAX_IMAGE_DIMENSION = 2048; // Max width/height in pixels
// Optimized for token efficiency

// Initialize
chrome.storage.local.get(['gemini_api_key', 'gemini_model', 'total_tokens', 'custom_functions', 'chat_history', 'pending_prompt'], (result) => {
    if (result.gemini_api_key) apiKeyInput.value = result.gemini_api_key;
    else {
        apiKeyInput.value = DEFAULT_API_KEY;
        chrome.storage.local.set({ gemini_api_key: DEFAULT_API_KEY });
    }

    if (result.gemini_model) modelSelect.value = result.gemini_model;
    else {
        modelSelect.value = DEFAULT_MODEL;
        chrome.storage.local.set({ gemini_model: DEFAULT_MODEL });
    }

    if (result.total_tokens) {
        totalTokens = result.total_tokens;
        tokenCountEl.textContent = totalTokens.toLocaleString();
    }

    if (result.custom_functions && Array.isArray(result.custom_functions)) {
        customFunctions = result.custom_functions;
    } else {
        customFunctions = [{
            id: 'default-improve',
            title: "Mejorar redacción",
            context: 'Corrige la redacción y gramática del siguiente texto de forma profesional: """ {{input}} """'
        }];
        chrome.storage.local.set({ custom_functions: customFunctions });
    }
    renderShortcuts();

    if (result.chat_history) {
        history = result.chat_history;
    }

    if (result.pending_prompt) {
        executePendingPrompt(result.pending_prompt);
    }
});

// Selection Box Handlers
function showSelectionBox(text) {
    lastSelectedText = text;
    selectionPreview.textContent = text.length > 100 ? text.substring(0, 100) + "..." : text;
    selectionBox.style.display = "block";
}

function hideSelectionBox() {
    selectionBox.style.display = "none";
    lastSelectedText = "";
}

acceptSelectionBtn.addEventListener('click', () => {
    const currentText = userInput.value.trim();
    if (currentText) {
        userInput.value = currentText + "\n\n" + lastSelectedText;
    } else {
        userInput.value = lastSelectedText;
    }
    hideSelectionBox();
    userInput.focus();
});

ignoreSelectionBtn.addEventListener('click', hideSelectionBox);
closeSelectionBoxBtn.addEventListener('click', hideSelectionBox);

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'text_selected') {
        showSelectionBox(request.text);
    }
    if (request.action === 'execute_custom') {
        executeFunction(request.title, request.context, request.text);
    }
});

// UI Panel Toggles
function closeAllPanels() {
    settingsPanel.classList.remove('active');
    historyPanel.classList.remove('active');
    customFunctionPanel.classList.remove('active');
    mainOverlay.classList.remove('active');
    editingId = null;
}

function openPanel(panel) {
    closeAllPanels();
    panel.classList.add('active');
    mainOverlay.classList.add('active');
}

settingsTrigger.addEventListener('click', () => {
    renderManagedShortcuts();
    if (tokenInfo) tokenInfo.textContent = totalTokens.toLocaleString();
    openPanel(settingsPanel);
});
addShortcutTrigger.addEventListener('click', () => {
    renderManagedShortcuts();
    if (tokenInfo) tokenInfo.textContent = totalTokens.toLocaleString();
    openPanel(settingsPanel);
});
saveSettingsBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    const model = modelSelect.value;
    chrome.storage.local.set({
        gemini_api_key: key,
        gemini_model: model
    }, () => {
        closeAllPanels();
    });
});
mainOverlay.addEventListener('click', closeAllPanels);

historyTrigger.addEventListener('click', () => {
    renderHistory();
    openPanel(historyPanel);
});
closeHistoryBtn.addEventListener('click', closeAllPanels);

addShortcutSettingsBtn.addEventListener('click', () => {
    fnModalTitle.textContent = "Crear Función Custom";
    fnTitleInput.value = '';
    fnContextInput.value = '';
    editingId = null;
    openPanel(customFunctionPanel);
});
closeFunctionBtn.addEventListener('click', closeAllPanels);

// Custom Functions logic
saveFunctionBtn.addEventListener('click', () => {
    const title = fnTitleInput.value.trim();
    const context = fnContextInput.value.trim();

    if (!title || !context) return;

    if (editingId !== null) {
        const index = customFunctions.findIndex(f => f.id === editingId);
        if (index !== -1) customFunctions[index] = { ...customFunctions[index], title, context };
    } else {
        customFunctions.push({ id: Date.now().toString(), title, context });
    }

    chrome.storage.local.set({ custom_functions: customFunctions });
    renderShortcuts();
    renderManagedShortcuts();

    closeAllPanels();
});

function renderShortcuts() {
    const existingChips = shortcutsBar.querySelectorAll('.shortcut-chip');
    existingChips.forEach(chip => chip.remove());

    customFunctions.forEach((fn) => {
        const chip = document.createElement('div');
        chip.className = 'shortcut-chip';
        chip.innerHTML = `<span>${fn.title}</span>`;
        chip.onclick = () => executeFunction(fn.title, fn.context);
        shortcutsBar.insertBefore(chip, addShortcutTrigger);
    });
}

function renderManagedShortcuts() {
    managedShortcutsList.innerHTML = '';
    customFunctions.forEach((fn) => {
        const item = document.createElement('div');
        item.className = 'manage-item';
        item.innerHTML = `
            <span>${fn.title}</span>
            <div class="manage-actions">
                <button class="action-btn mini-edit" title="Editar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="action-btn mini-delete" style="color: #ff453a;" title="Eliminar">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        `;

        item.querySelector('.mini-edit').onclick = () => {
            editingId = fn.id;
            fnModalTitle.textContent = "Editar mensaje";
            fnTitleInput.value = fn.title;
            fnContextInput.value = fn.context;
            openPanel(customFunctionPanel);
        };

        item.querySelector('.mini-delete').onclick = () => {
            if (confirm(`¿Eliminar atajo "${fn.title}"?`)) {
                customFunctions = customFunctions.filter(f => f.id !== fn.id);
                chrome.storage.local.set({ custom_functions: customFunctions });
                renderShortcuts();
                renderManagedShortcuts();
            }
        };

        managedShortcutsList.appendChild(item);
    });
}

function executeFunction(title, context, textOverride = null) {
    const textToProcess = textOverride || lastSelectedText || userInput.value.trim();

    if (!textToProcess) {
        alert("Escribe algo en el chat o selecciona un texto en la web primero.");
        return;
    }

    let combinedPrompt;
    if (context.includes("{{input}}")) {
        combinedPrompt = context.replace("{{input}}", textToProcess);
    } else {
        // Add spacing between instruction and text
        combinedPrompt = `${context}\n\n${textToProcess}`;
    }

    userInput.value = combinedPrompt;
    if (lastSelectedText) hideSelectionBox();
    sendMessage();
}

// Conversation Management
function startNewChat() {
    if (currentChatMessages.length > 0) saveToHistory();
    currentChatMessages = [];
    currentConversationId = null;
    chatContainer.innerHTML = `<div class="message ai-message">¡Nueva conversación iniciada!</div>`;
    userInput.value = '';
}

newChatBtn.addEventListener('click', startNewChat);

clearActualBtn.addEventListener('click', () => {
    chatContainer.innerHTML = `<div class="message ai-message">Chat limpiado. Puedes seguir hablando.</div>`;
});

function saveToHistory() {
    if (currentChatMessages.length === 0) return;
    const firstUserMsg = currentChatMessages.find(m => m.role === 'user');
    const title = firstUserMsg ? (firstUserMsg.parts[0].text ? firstUserMsg.parts[0].text.substring(0, 30) + '...' : 'Imagen') : 'Conversación';

    const chatEntry = {
        id: currentConversationId || Date.now(),
        title: title,
        date: new Date().toLocaleString(),
        messages: [...currentChatMessages]
    };

    if (currentConversationId) {
        const index = history.findIndex(h => h.id === currentConversationId);
        if (index !== -1) history[index] = chatEntry;
        else history.unshift(chatEntry);
    } else {
        history.unshift(chatEntry);
        currentConversationId = chatEntry.id;
    }
    chrome.storage.local.set({ chat_history: history });
}

function renderHistory() {
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<div style="padding: 16px; color: #8e8e93; font-size: 0.8rem;">Sin historial.</div>';
        return;
    }
    history.forEach((chat) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.innerHTML = `<div class="history-item-title">${chat.title}</div><div class="history-item-date">${chat.date}</div>`;
        item.onclick = () => {
            currentChatMessages = chat.messages;
            currentConversationId = chat.id;
            chatContainer.innerHTML = '';
            currentChatMessages.forEach(msg => {
                const role = msg.role === 'user' ? 'user' : 'ai';
                const text = msg.parts.find(p => p.text)?.text;
                addMessageUI(text, role);
            });
            closeAllPanels();
        };
        historyList.appendChild(item);
    });
}

// Message UI
function addMessageUI(text, sender, imageUrls = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;

    imageUrls.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.className = 'message-image';
        msgDiv.appendChild(img);
    });

    if (text) {
        const textSpan = document.createElement('div');
        // Simple formatting without external library
        if (sender === 'ai') {
            // Basic markdown-like formatting
            let formatted = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
                .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
                .replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 4px;">$1</code>') // Code
                .replace(/\n/g, '<br>'); // Line breaks
            textSpan.innerHTML = formatted;
        } else {
            textSpan.textContent = text;
        }
        msgDiv.appendChild(textSpan);

        // Add copy button for AI messages
        if (sender === 'ai') {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Copiar';
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(text).then(() => {
                    copyBtn.textContent = '✓ Copiado';
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.textContent = 'Copiar';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('[PartnerAI] Copy failed:', err);
                });
            };
            msgDiv.appendChild(copyBtn);
        }
    }

    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send Message - CORE FUNCTION
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text && currentScreenshots.length === 0 && attachedFiles.length === 0) return;

    const apiKey = apiKeyInput.value.trim() || DEFAULT_API_KEY;
    const model = modelSelect.value || DEFAULT_MODEL;

    addMessageUI(text, 'user', currentScreenshots.map(s => s.dataUrl));

    const parts = [];
    if (text) parts.push({ text: text });

    // Add screenshots
    currentScreenshots.forEach(s => {
        parts.push({
            inline_data: {
                mime_type: "image/png",
                data: s.dataUrl.split(',')[1]
            }
        });
    });

    // Add attached files
    attachedFiles.forEach(file => {
        parts.push({
            inline_data: {
                mime_type: file.type,
                data: file.dataUrl.split(',')[1]
            }
        });
    });

    console.log('[PartnerAI] Sending message...', {
        text: text.substring(0, 50),
        screenshotCount: currentScreenshots.length,
        filesCount: attachedFiles.length,
        totalParts: parts.length
    });

    currentChatMessages.push({ role: 'user', parts });

    userInput.value = '';
    currentScreenshots = [];
    attachedFiles = [];
    renderScreenshotPreviews();
    renderFilePreview();

    loadingEl.style.display = 'block';
    sendBtn.disabled = true;

    try {
        const contextWindow = currentChatMessages.slice(-CONTEXT_WINDOW_LIMIT);
        console.log('[PartnerAI] Context window:', contextWindow.length, 'messages');

        const response = await callGemini(contextWindow, apiKey, model);
        console.log('[PartnerAI] Raw API Response:', JSON.stringify(response).substring(0, 200));

        if (!response) {
            console.error('[PartnerAI] Response is null/undefined');
            addMessageUI(`❌ **Error:** No se recibió respuesta del servidor. Verifica tu conexión.`, 'ai');
            return;
        }

        if (response.error) {
            console.error('[PartnerAI] API Error:', response.error);
            const errorMsg = response.error.message || JSON.stringify(response.error);
            addMessageUI(`❌ **Error API:** ${errorMsg}`, 'ai');
            return;
        }

        if (response.candidates && response.candidates.length > 0 && response.candidates[0].content) {
            const aiText = response.candidates[0].content.parts[0].text;
            console.log('[PartnerAI] AI Response received, length:', aiText.length);
            updateTokens(response.usageMetadata?.totalTokenCount || 0);
            addMessageUI(aiText, 'ai');
            currentChatMessages.push({ role: 'model', parts: [{ text: aiText }] });
            saveToHistory();
        } else {
            console.warn('[PartnerAI] No valid candidates:', response);
            if (response.promptFeedback) {
                addMessageUI(`⚠️ **Bloqueado:** ${response.promptFeedback.blockReason || 'Contenido bloqueado por seguridad'}`, 'ai');
            } else {
                addMessageUI(`⚠️ **Sin respuesta:** El modelo no generó contenido. Respuesta: ${JSON.stringify(response).substring(0, 100)}`, 'ai');
            }
        }
    } catch (error) {
        console.error('[PartnerAI] Exception:', error);
        console.error('[PartnerAI] Stack:', error.stack);
        addMessageUI(`❌ **Error de Conexión:** ${error.message}. Verifica tu API Key y conexión.`, 'ai');
    } finally {
        console.log('[PartnerAI] Cleaning up...');
        loadingEl.style.display = 'none';
        sendBtn.disabled = false;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

async function callGemini(messages, apiKey, model) {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const contents = messages.map(m => ({
            role: m.role === 'model' ? 'model' : 'user',
            parts: m.parts
        }));

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { error: errorData.error || { message: `HTTP ${response.status}` } };
        }

        return await response.json();
    } catch (e) {
        return { error: { message: e.message } };
    }
}

function updateTokens(newTokens) {
    totalTokens += newTokens;
    tokenCountEl.textContent = totalTokens.toLocaleString();
    chrome.storage.local.set({ total_tokens: totalTokens });
}

// Screenshot logic
captureBtn.addEventListener('click', () => {
    const totalImages = currentScreenshots.length + attachedFiles.filter(f => f.type.startsWith('image/')).length;

    if (totalImages >= MAX_TOTAL_IMAGES) {
        alert(`⚠️ Límite alcanzado: Máximo ${MAX_TOTAL_IMAGES} imágenes por mensaje para proteger tu cuota de tokens.`);
        return;
    }

    chrome.runtime.sendMessage({ action: 'capture_tab' }, (response) => {
        if (response && response.image) {
            currentScreenshots.push({ id: Date.now().toString(), dataUrl: response.image });
            renderScreenshotPreviews();
        }
    });
});

function renderScreenshotPreviews() {
    if (!previewImagesContainer) {
        console.warn('[PartnerAI] previewImagesContainer not found');
        return;
    }

    previewImagesContainer.innerHTML = '';
    if (currentScreenshots.length === 0) {
        previewImagesContainer.style.display = 'none';
        return;
    }
    previewImagesContainer.style.display = 'flex';
    currentScreenshots.forEach(s => {
        const wrapper = document.createElement('div');
        wrapper.className = 'preview-wrapper';
        wrapper.innerHTML = `
            <img src="${s.dataUrl}" class="preview-img-thumb">
            <div class="remove-thumb" data-id="${s.id}">×</div>
        `;
        wrapper.querySelector('.remove-thumb').onclick = () => {
            currentScreenshots = currentScreenshots.filter(img => img.id !== s.id);
            renderScreenshotPreviews();
        };
        previewImagesContainer.appendChild(wrapper);
    });
}

function executePendingPrompt(prompt) {
    userInput.value = prompt;
    chrome.storage.local.remove('pending_prompt');
    sendMessage();
}

// CRITICAL: Event Listeners for Send
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// File Upload Logic
const MAX_FILES = 5;
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

attachFileBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);

    if (attachedFiles.length + files.length > MAX_FILES) {
        alert(`Máximo ${MAX_FILES} archivos permitidos.`);
        return;
    }

    files.forEach(file => {
        if (file.size > MAX_FILE_SIZE) {
            alert(`El archivo "${file.name}" excede el límite de 15MB.`);
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            attachedFiles.push({
                id: Date.now().toString() + Math.random(),
                name: file.name,
                type: file.type,
                dataUrl: event.target.result
            });
            renderFilePreview();
        };

        if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
        } else {
            // For non-images, just store metadata (Gemini 2.0 supports PDFs)
            reader.readAsDataURL(file);
        }
    });

    fileInput.value = '';
});

function renderFilePreview() {
    filePreviewContainer.innerHTML = '';
    if (attachedFiles.length === 0) {
        filePreviewContainer.style.display = 'none';
        return;
    }
    filePreviewContainer.style.display = 'flex';

    attachedFiles.forEach(file => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position: relative; padding: 8px 12px; background: var(--card-bg); border-radius: 6px; font-size: 0.75rem; display: flex; align-items: center; gap: 6px;';

        const icon = file.type.startsWith('image/') ? '🖼️' : '📄';
        wrapper.innerHTML = `
            <span>${icon}</span>
            <span style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file.name}</span>
            <button class="remove-file" data-id="${file.id}" style="background: none; border: none; color: #ff453a; cursor: pointer; padding: 0; font-size: 1rem;">×</button>
        `;

        wrapper.querySelector('.remove-file').onclick = () => {
            attachedFiles = attachedFiles.filter(f => f.id !== file.id);
            renderFilePreview();
        };

        filePreviewContainer.appendChild(wrapper);
    });
}

// Info Toggles
if (aboutToggle) {
    aboutToggle.addEventListener('click', () => {
        const isOpen = aboutContent.style.display === 'block';
        aboutContent.style.display = isOpen ? 'none' : 'block';
        aboutToggle.querySelector('.toggle-icon').textContent = isOpen ? '▼' : '▲';
    });
}

if (howToggle) {
    howToggle.addEventListener('click', () => {
        const isOpen = howContent.style.display === 'block';
        howContent.style.display = isOpen ? 'none' : 'block';
        howToggle.querySelector('.toggle-icon').textContent = isOpen ? '▼' : '▲';
    });
}

// Clipboard Paste Support for Images
userInput.addEventListener('paste', async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let item of items) {
        if (item.type.startsWith('image/')) {
            e.preventDefault();

            const totalImages = currentScreenshots.length + attachedFiles.filter(f => f.type.startsWith('image/')).length;

            if (totalImages >= MAX_TOTAL_IMAGES) {
                alert(`⚠️ Límite alcanzado: Máximo ${MAX_TOTAL_IMAGES} imágenes por mensaje.\n\nEsto protege tu cuota de tokens. Elimina una imagen antes de pegar otra.`);
                return;
            }

            const file = item.getAsFile();
            if (!file) continue;

            console.log('[PartnerAI] Clipboard image detected:', file.size, 'bytes');

            // Check size limit
            if (file.size > MAX_IMAGE_SIZE) {
                alert(`⚠️ Imagen demasiado grande (${(file.size / 1024 / 1024).toFixed(1)}MB).\n\nMáximo permitido: 5MB para proteger tu cuota.`);
                continue;
            }

            // Process and potentially compress image
            try {
                const processedDataUrl = await processImage(file);

                currentScreenshots.push({
                    id: Date.now().toString() + Math.random(),
                    dataUrl: processedDataUrl
                });

                renderScreenshotPreviews();
                console.log('[PartnerAI] Clipboard image added');
            } catch (error) {
                console.error('[PartnerAI] Error processing clipboard image:', error);
                alert('❌ Error al procesar la imagen del portapapeles.');
            }

            break; // Only process first image
        }
    }
});

// Image processing and compression
async function processImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                // Check if compression is needed
                const needsResize = img.width > MAX_IMAGE_DIMENSION || img.height > MAX_IMAGE_DIMENSION;

                if (!needsResize) {
                    resolve(e.target.result);
                    return;
                }

                // Compress image
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > height) {
                    if (width > MAX_IMAGE_DIMENSION) {
                        height = (height * MAX_IMAGE_DIMENSION) / width;
                        width = MAX_IMAGE_DIMENSION;
                    }
                } else {
                    if (height > MAX_IMAGE_DIMENSION) {
                        width = (width * MAX_IMAGE_DIMENSION) / height;
                        height = MAX_IMAGE_DIMENSION;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
                console.log('[PartnerAI] Image compressed:', img.width, 'x', img.height, '→', width, 'x', height);
                resolve(compressedDataUrl);
            };

            img.onerror = reject;
            img.src = e.target.result;
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
