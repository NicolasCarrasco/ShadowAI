# ShadowAI with Gemini | Chrome Extension

> 🚀 **Your Personal AI Assistant with Gemini 2.0 Flash - Use Your Own API Key**  
> 🌟 **Tu Asistente Personal de IA con Gemini 2.0 Flash - Usa tu Propia API Key**

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)](https://github.com/NicolasCarrasco/ShadowAI)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0_Flash-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/paypalme/nicolascarrascoe)

[English](#english) | [Español](#español)

---

<a name="english"></a>
## 🇬🇧 English

### ✨ Key Features

- 🔑 **Use Your Own Gemini API Key** - No monthly subscriptions
- 💬 **Smart Chat in Sidepanel** - Always accessible while browsing
- 📸 **Integrated Screenshot Capture** - Analyze images directly
- 📋 **Paste Images from Clipboard** (Ctrl+V) - Automatic compression
- ⚡ **Customizable Shortcuts** - Create quick functions for repetitive tasks
- 📝 **Intelligent Text Selection** - Process selected text from any website
- 💾 **Local History** - All your conversations saved
- 🛡️ **Safety Limits** - Automatic protection for your token quota
- 🌐 **Multi-API Support** *(Coming Soon)* - Support for multiple AI providers

### 🎯 Competitive Advantage

Unlike other AI plugins that charge monthly subscriptions:

✅ **100% Free** - Only pay for direct consumption to Google  
✅ **No Intermediaries** - Your API Key, your control  
✅ **Total Transparency** - Real-time token counter  
✅ **Cost Optimized** - Context window limited to 10 messages  

### 📦 Installation

#### Option 1: From Source Code

1. **Clone this repository**
```bash
git clone https://github.com/NicolasCarrasco/ShadowAI.git
cd ShadowAI
```

2. **Open Chrome and go to** `chrome://extensions`

3. **Enable "Developer mode"** (top right corner)

4. **Click "Load unpacked extension"**

5. **Select the project folder**

#### Option 2: .crx File (Coming Soon)

### 🔧 Setup

1. **Get your Gemini API Key**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API Key
   - Copy it

2. **Configure the extension**
   - Open ShadowAI Sidepanel
   - Click "Settings"
   - Paste your API Key
   - Done!

### 🚀 Usage

#### Basic Chat
1. Open the Sidepanel (click extension icon)
2. Type your question
3. Press Enter or click Send

#### Screenshot Capture
1. Click the camera icon 📷
2. The capture is automatically added
3. Write your question about the image
4. Send

#### Paste Images
1. Copy any image (Ctrl+C)
2. Click in the textarea
3. Paste (Ctrl+V)
4. Image will appear in preview

#### Text Selection
1. Select text on any webpage
2. A suggestion will appear in the Sidepanel
3. Click "Accept selection"
4. Use a shortcut or write your question

#### Custom Shortcuts
1. Go to Settings → Manage Shortcuts
2. Create a new shortcut
3. Define title and instruction
4. Use `{{input}}` where you want to insert text
5. Save and use it from the bottom bar

**Shortcut Example:**
- **Title**: Translate to English
- **Instruction**: `Translate the following text to English: {{input}}`

### 🛡️ Safety Limits

To protect your token quota:

- **Maximum 3 images** per message
- **Maximum 5MB** per image (automatic compression if exceeded)
- **10 message window** (only last 10 sent to API)
- **Smart compression** for images larger than 2048px

### 📊 Consumption Monitoring

- **Token counter** visible in footer
- **Details in Settings** → How does it work?
- **Monitor your spending** at [Google Cloud Console](https://console.cloud.google.com/)

### 🔮 Coming Soon

- 🔄 **Multi-API Support** - OpenAI, Claude, and more
- 🎨 **Custom Themes** - Personalize your interface
- 📱 **Mobile Version** - Extension for mobile browsers
- 🔊 **Voice Input** - Talk to your AI assistant

### 💖 Support the Project

If you find it useful:
- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest new features
- 💵 [Donate via PayPal](https://www.paypal.com/paypalme/nicolascarrascoe)

---

<a name="español"></a>
## 🇪🇸 Español

### ✨ Características Principales

- 🔑 **Usa tu propia API Key de Gemini** - Sin suscripciones mensuales
- 💬 **Chat inteligente en el Sidepanel** - Siempre accesible mientras navegas
- 📸 **Captura de pantalla integrada** - Analiza imágenes directamente
- 📋 **Pega imágenes desde portapapeles** (Ctrl+V) - Compresión automática
- ⚡ **Atajos personalizables** - Crea funciones rápidas para tareas repetitivas
- 📝 **Selección de texto inteligente** - Procesa texto seleccionado en cualquier web
- 💾 **Historial local** - Todas tus conversaciones guardadas
- 🛡️ **Límites de seguridad** - Protección automática de tu cuota de tokens
- 🌐 **Soporte Multi-API** *(Próximamente)* - Soporte para múltiples proveedores de IA

### 🎯 Ventaja Competitiva

A diferencia de otros plugins de IA que cobran suscripción mensual:

✅ **100% Gratuito** - Solo pagas el consumo directo a Google  
✅ **Sin intermediarios** - Tu API Key, tu control  
✅ **Transparencia total** - Contador de tokens en tiempo real  
✅ **Optimizado para costos** - Ventana de contexto limitada a 10 mensajes  

### 📦 Instalación

#### Opción 1: Desde el código fuente

1. **Clona este repositorio**
```bash
git clone https://github.com/NicolasCarrasco/ShadowAI.git
cd ShadowAI
```

2. **Abre Chrome y ve a** `chrome://extensions`

3. **Activa el "Modo de desarrollador"** (esquina superior derecha)

4. **Haz clic en "Cargar extensión sin empaquetar"**

5. **Selecciona la carpeta del proyecto**

#### Opción 2: Archivo .crx (Próximamente)

### 🔧 Configuración

1. **Obtén tu API Key de Gemini**
   - Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Crea una nueva API Key
   - Cópiala

2. **Configura la extensión**
   - Abre el Sidepanel de ShadowAI
   - Haz clic en "Ajustes"
   - Pega tu API Key
   - ¡Listo!

### 🚀 Uso

#### Chat Básico
1. Abre el Sidepanel (clic en el icono de la extensión)
2. Escribe tu pregunta
3. Presiona Enter o clic en Enviar

#### Captura de Pantalla
1. Haz clic en el icono de cámara 📷
2. La captura se añade automáticamente
3. Escribe tu pregunta sobre la imagen
4. Envía

#### Pegar Imágenes
1. Copia cualquier imagen (Ctrl+C)
2. Haz clic en el textarea
3. Pega (Ctrl+V)
4. La imagen aparecerá en el preview

#### Selección de Texto
1. Selecciona texto en cualquier página web
2. Aparecerá una sugerencia en el Sidepanel
3. Haz clic en "Aceptar selección"
4. Usa un atajo o escribe tu pregunta

#### Atajos Personalizados
1. Ve a Ajustes → Administrar Atajos
2. Crea un nuevo atajo
3. Define el título y la instrucción
4. Usa `{{input}}` donde quieras insertar el texto
5. Guarda y úsalo desde la barra inferior

**Ejemplo de atajo:**
- **Título**: Traducir al inglés
- **Instrucción**: `Traduce el siguiente texto al inglés: {{input}}`

### 🛡️ Límites de Seguridad

Para proteger tu cuota de tokens:

- **Máximo 3 imágenes** por mensaje
- **Máximo 5MB** por imagen (compresión automática si excede)
- **Ventana de 10 mensajes** (solo se envían los últimos 10 a la API)
- **Compresión inteligente** de imágenes mayores a 2048px

### 📊 Monitoreo de Consumo

- **Contador de tokens** visible en el footer
- **Detalle en Ajustes** → ¿Cómo funciona?
- **Monitorea tu gasto** en [Google Cloud Console](https://console.cloud.google.com/)

### 🔮 Próximamente

- 🔄 **Soporte Multi-API** - OpenAI, Claude y más
- 🎨 **Temas Personalizados** - Personaliza tu interfaz
- 📱 **Versión Móvil** - Extensión para navegadores móviles
- 🔊 **Entrada de Voz** - Habla con tu asistente de IA

### 💖 Apoya el Proyecto

Si te resulta útil:
- ⭐ Dale una estrella al repositorio
- 🐛 Reporta bugs
- 💡 Sugiere nuevas funcionalidades
- 💵 [Dona vía PayPal](https://www.paypal.com/paypalme/nicolascarrascoe)

---

## 🏗️ Project Structure | Estructura del Proyecto

```
ShadowAI/
├── manifest.json          # Extension configuration | Configuración de la extensión
├── sidepanel.html         # Main interface | Interfaz principal
├── sidepanel.js           # Chat logic | Lógica del chat
├── background.js          # Service worker
├── content.js             # Injected script | Script inyectado
├── content.css            # Content styles | Estilos para content
├── README.md              # This file | Este archivo
└── README-DEV.md          # Developer docs | Docs para desarrolladores
```

## 🤝 Contributing | Contribuir

Contributions are welcome! | ¡Las contribuciones son bienvenidas!

1. Fork the project | Fork el proyecto
2. Create a branch | Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit your changes | Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push to branch | Push a la rama (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Before contributing**, read `README-DEV.md` | **Antes de contribuir**, lee `README-DEV.md`

## ⚠️ Important | Importante

- **Use at your own risk** - Monitor your API consumption | **Usa bajo tu responsabilidad** - Monitorea tu consumo de API
- **Don't share your API Key** - It's personal | **No compartas tu API Key** - Es personal
- **Check Gemini limits** - [Google AI Pricing](https://ai.google.dev/pricing)

## 📄 License | Licencia

MIT License - see [LICENSE](LICENSE) file | Licencia MIT - ver archivo [LICENSE](LICENSE)

## 👨‍💻 Author | Autor

**Nicolás Carrasco**  
📧 [hello@nicolascarrasco.dev](mailto:hello@nicolascarrasco.dev)  
💼 [LinkedIn](https://linkedin.com/in/nicolascarrascoe)  
🐙 [GitHub](https://github.com/NicolasCarrasco)

---

## � Donations | Donaciones

Support this project | Apoya este proyecto:

[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.com/paypalme/nicolascarrascoe)

**PayPal**: [nicolascarrascoe](https://www.paypal.com/paypalme/nicolascarrascoe)

---

## � Keywords for SEO

Chrome Extension, Gemini AI, Google AI, AI Assistant, ChatGPT Alternative, Free AI, AI Chrome Plugin, Gemini 2.0, AI Chatbot, Browser AI, Screenshot AI, Image Analysis, Text Processing, Custom AI Functions, AI Shortcuts, Local AI History, Token Management, API Key, Open Source AI, Privacy-First AI

Extensión Chrome, IA Gemini, Google IA, Asistente IA, Alternativa ChatGPT, IA Gratis, Plugin Chrome IA, Gemini 2.0, Chatbot IA, IA Navegador, IA Captura Pantalla, Análisis Imágenes, Procesamiento Texto, Funciones IA Personalizadas, Atajos IA, Historial IA Local, Gestión Tokens, Clave API, IA Código Abierto, IA Privacidad

---

**Made with ❤️ in 2025 | Hecho con ❤️ en 2025**  
**Community Contribution | Aporte a la Comunidad**
