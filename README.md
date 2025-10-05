# 🧰 File Converter Pro

A fully browser-based file conversion web app built using **HTML**, **CSS (Tailwind + custom styles)**, and **JavaScript**.  
This tool provides multiple converters and resizers — **PDF to JPG**, **Image to PDF**, **PDF Resizer**, and **Image Resizer** — all running locally in the browser for complete privacy.

---

## 🚀 Features

### 🔹 PDF to JPG Converter
- Converts PDF pages into high-quality JPG images.
- Uses `pdf.js` for rendering and conversion.
- Supports drag & drop or manual file upload.
- Allows downloading individual or all converted images.

### 🔹 Image to PDF Converter
- Combines multiple JPG/PNG images into a single PDF.
- Uses `jsPDF` for dynamic PDF generation.
- Displays live conversion progress.

### 🔹 PDF Resizer
- Resizes all pages in a PDF to custom dimensions.
- Automatically adjusts aspect ratios.
- Outputs a resized, downloadable PDF.

### 🔹 Image Resizer
- Resizes JPG, PNG, or GIF images.
- Provides width/height inputs for pixel-perfect resizing.
- Preview before download.

---

## 🧩 Technologies Used

| Component | Technology |
|------------|-------------|
| Frontend | HTML5, CSS3, TailwindCSS |
| Scripting | Vanilla JavaScript (ES6) |
| PDF Handling | [pdf.js](https://mozilla.github.io/pdf.js/) |
| PDF Creation | [jsPDF](https://github.com/parallax/jsPDF) |
| UI Icons | [Font Awesome](https://fontawesome.com/) |

---

## ⚙️ Project Structure


---

## 🧠 Code Overview

### `index.html`
- Defines 4 main sections:
  - **Home Section** – Navigation dashboard.
  - **Converters** – Separate pages for PDF/Image conversions and resizing.
- Includes placeholder ad spaces for Google AdSense.
- Responsive layout with TailwindCSS classes.

### `App.js`
- Manages navigation between converter views.
- Defines 4 classes:
  - `PDFToJPGConverter`
  - `ImageToPDFConverter`
  - `PDFResizer`
  - `ImageResizer`
- Implements:
  - Drag-and-drop upload
  - Conversion and resizing using canvas & PDF libraries
  - Progress tracking and UI updates

### `style.css`
- Adds custom animations (`fade-in`, `pulse`, etc.)
- Enhances interactivity for drag-over and download button effects.

---

## 🔒 Privacy

All conversions are processed **locally in your browser**.  
No files are uploaded or stored on any server.  
Your documents remain **private and secure**.

---

## 🖥️ How to Run Locally

1. Clone or download this repository.
2. Open `index.html` directly in any modern browser.
3. No server setup is required — everything runs client-side.

```bash
git clone https://github.com/yourusername/file-converter-pro.git
cd file-converter-pro
start index.html
