# ShadowAI - Notas de Desarrollo

## ⚠️ ERRORES CRÍTICOS A EVITAR

### 1. **IDs de HTML - NO USAR COMILLAS ESCAPADAS**
❌ **INCORRECTO:**
```html
<div id=\"preview-images-container">
<div id=\"file-preview-container\">
```

✅ **CORRECTO:**
```html
<div id="preview-images-container">
<div id="file-preview-container">
```

**Razón**: Las comillas escapadas (`\"`) hacen que JavaScript no pueda encontrar los elementos con `getElementById()`, causando errores de `Cannot set properties of null`.

---

### 2. **Content Security Policy (CSP) - NO USAR CDNs EXTERNOS**
❌ **INCORRECTO:**
```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
```

✅ **CORRECTO:**
- Usar librerías locales en la carpeta del proyecto
- O implementar funcionalidad básica sin dependencias externas

**Razón**: Chrome Extensions tienen políticas de seguridad estrictas que bloquean scripts externos.

---

### 3. **Elementos del DOM - SIEMPRE VALIDAR EXISTENCIA**
❌ **INCORRECTO:**
```javascript
previewImagesContainer.innerHTML = '';
```

✅ **CORRECTO:**
```javascript
if (!previewImagesContainer) {
    console.warn('[ShadowAI] Element not found');
    return;
}
previewImagesContainer.innerHTML = '';
```

**Razón**: Previene errores cuando el DOM no está completamente cargado o el elemento no existe.

---

## 📋 IDs Críticos del Proyecto

**NO MODIFICAR estos IDs sin actualizar el JavaScript correspondiente:**

### Contenedores principales:
- `chat-container` - Contenedor de mensajes
- `user-input` - Textarea de entrada
- `send-btn` - Botón de envío
- `loading` - Indicador de carga

### Paneles:
- `settings-panel` - Panel de configuración
- `history-panel` - Panel de historial
- `custom-function-panel` - Panel de funciones personalizadas
- `main-overlay` - Overlay oscuro

### Preview y archivos:
- `preview-images-container` - Previews de screenshots
- `file-preview-container` - Previews de archivos adjuntos
- `file-input` - Input oculto para archivos
- `attach-file-btn` - Botón de adjuntar

### Shortcuts:
- `shortcuts-bar` - Barra de atajos
- `managed-shortcuts-list` - Lista de atajos en settings

### Info toggles:
- `about-toggle` - Toggle de "Acerca de"
- `about-content` - Contenido de "Acerca de"
- `how-toggle` - Toggle de "¿Cómo funciona?"
- `how-content` - Contenido de "¿Cómo funciona?"
- `token-info` - Span con contador de tokens

---

## 🔧 Debugging

### Ver logs en consola:
1. Abrir Sidepanel
2. Presionar F12
3. Buscar logs que empiecen con `[ShadowAI]`

### Recargar extensión después de cambios:
1. Ir a `chrome://extensions`
2. Click en "Recargar" ⟳ en la tarjeta de ShadowAI
3. Cerrar y abrir el Sidepanel

---

## 📦 Estructura de Archivos

```
ShadowAI/
├── manifest.json          # Configuración de la extensión
├── sidepanel.html         # UI principal
├── sidepanel.js           # Lógica principal
├── background.js          # Service worker
├── content.js             # Script inyectado en páginas
├── content.css            # Estilos para content script
└── README-DEV.md          # Este archivo
```

---

## 🚀 Flujo de Mensajes

1. Usuario escribe en `user-input`
2. Click en `send-btn` o Enter
3. `sendMessage()` se ejecuta
4. Construye `parts` array con texto + screenshots + archivos
5. Llama a `callGemini()` con contexto limitado (10 mensajes)
6. Gemini responde con JSON
7. `addMessageUI()` renderiza la respuesta
8. `saveToHistory()` guarda en `chrome.storage.local`

---

## 💾 Almacenamiento Local

**Datos guardados en `chrome.storage.local`:**
- `gemini_api_key` - API Key del usuario
- `gemini_model` - Modelo seleccionado
- `total_tokens` - Contador acumulado de tokens
- `custom_functions` - Array de funciones personalizadas
- `chat_history` - Historial de conversaciones
- `pending_prompt` - Prompt pendiente (para abrir sidepanel)

---

## 🛡️ Límites de Seguridad (Protección de Cuota)

**Para evitar gastos excesivos de tokens, se implementaron los siguientes límites:**

### Imágenes:
- **Máximo 3 imágenes** por mensaje (screenshots + portapapeles + archivos combinados)
- **Máximo 5MB** por imagen
- **Compresión automática**: Imágenes mayores a 2048px se redimensionan automáticamente
- **Calidad JPEG**: 85% para balance entre calidad y tamaño

### Contexto:
- **Ventana de 10 mensajes**: Solo los últimos 10 mensajes se envían a la API
- El historial completo se guarda localmente, pero no consume tokens

### Pegar Imágenes desde Portapapeles:
✅ **Funcionalidad habilitada**: Ctrl+V en el textarea
- Detecta automáticamente imágenes copiadas
- Aplica los mismos límites de seguridad
- Comprime si es necesario
- Muestra preview antes de enviar

**Ejemplo de uso:**
1. Copia una imagen (Ctrl+C en cualquier lugar)
2. Haz clic en el textarea de ShadowAI
3. Pega (Ctrl+V)
4. La imagen aparecerá en el preview
5. Escribe tu pregunta y envía

---

## 🎨 Formato de Texto

**Markdown básico soportado:**
- `**texto**` → **negrita**
- `*texto*` → *cursiva*
- `` `código` `` → `código inline`
- `\n` → salto de línea

**NO soportado** (por limitaciones de CSP):
- Listas complejas
- Tablas
- Bloques de código con syntax highlighting

---

**Última actualización**: 2025-12-24
**Desarrollador**: Nicolás Carrasco

