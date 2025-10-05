  // Navigation logic for Home and Converter views
  function showSection(sectionId) {
    // Hide all sections
    document.getElementById('homeSection').classList.add('hidden');
    document.getElementById('pdfToJpgSection').classList.add('hidden');
    document.getElementById('imageToPdfSection').classList.add('hidden');
    document.getElementById('pdfResizerSection').classList.add('hidden');
    document.getElementById('imageResizerSection').classList.add('hidden');
    
    // Show the selected section
    document.getElementById(sectionId).classList.remove('hidden');
  }

document.addEventListener('DOMContentLoaded', () => {
    // Show Home by default
    showSection('homeSection');

    // Navigation event listeners
    document.getElementById('navHome').addEventListener('click', () => showSection('homeSection'));
    document.getElementById('navPDFtoJPG').addEventListener('click', () => showSection('pdfToJpgSection'));
    document.getElementById('navImageToPDF').addEventListener('click', () => showSection('imageToPdfSection'));
    document.getElementById('navPDFResizer').addEventListener('click', () => showSection('pdfResizerSection'));
    document.getElementById('navImageResizer').addEventListener('click', () => showSection('imageResizerSection'));
    document.getElementById('openPDFtoJPG').addEventListener('click', () => showSection('pdfToJpgSection'));
    document.getElementById('openImageToPDF').addEventListener('click', () => showSection('imageToPdfSection'));
    document.getElementById('openPDFResizer').addEventListener('click', () => showSection('pdfResizerSection'));
    document.getElementById('openImageResizer').addEventListener('click', () => showSection('imageResizerSection'));

    // Initialize converters when their sections are shown
    let pdfToJpgInitialized = false;
    let imageToPdfInitialized = false;
    let pdfResizerInitialized = false;
    let imageResizerInitialized = false;

    function initPDFToJPG() {
        if (!pdfToJpgInitialized) {
            new PDFToJPGConverter();
            pdfToJpgInitialized = true;
        }
    }

    function initImageToPDF() {
        if (!imageToPdfInitialized) {
            new ImageToPDFConverter();
            imageToPdfInitialized = true;
        }
    }

    function initPDFResizer() {
        if (!pdfResizerInitialized) {
            new PDFResizer();
            pdfResizerInitialized = true;
        }
    }

    function initImageResizer() {
        if (!imageResizerInitialized) {
            new ImageResizer();
            imageResizerInitialized = true;
        }
    }

    // PDF to JPG
    document.getElementById('navPDFtoJPG').addEventListener('click', initPDFToJPG);
    document.getElementById('openPDFtoJPG').addEventListener('click', initPDFToJPG);

    // Image to PDF
    document.getElementById('navImageToPDF').addEventListener('click', initImageToPDF);
    document.getElementById('openImageToPDF').addEventListener('click', initImageToPDF);

    // PDF Resizer
    document.getElementById('navPDFResizer').addEventListener('click', initPDFResizer);
    document.getElementById('openPDFResizer').addEventListener('click', initPDFResizer);

    // Image Resizer
    document.getElementById('navImageResizer').addEventListener('click', initImageResizer);
    document.getElementById('openImageResizer').addEventListener('click', initImageResizer);
});

// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

class PDFToJPGConverter {
    constructor() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.progressSection = document.getElementById('progressSection');
        this.progressBar = document.getElementById('progressBar');
        this.progressText = document.getElementById('progressText');
        this.processingText = document.getElementById('processingText');
        this.resultsSection = document.getElementById('resultsSection');
        this.imagesContainer = document.getElementById('imagesContainer');
        this.downloadAllBtn = document.getElementById('downloadAllBtn');
        this.convertedImages = [];
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Upload area click
        this.uploadArea.addEventListener('click', () => {
            this.fileInput.click();
        });

        // File input change
        this.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type === 'application/pdf') {
                this.handleFileUpload(file);
            }
        });

        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('drag-over');
        });

        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('drag-over');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('drag-over');
            
            const file = e.dataTransfer.files[0];
            if (file && file.type === 'application/pdf') {
                this.handleFileUpload(file);
            }
        });

        // Download all button
        this.downloadAllBtn.addEventListener('click', () => {
            this.downloadAllImages();
        });
    }

    async handleFileUpload(file) {
        this.showProgress();
        this.convertedImages = [];
        this.imagesContainer.innerHTML = '';
        this.resultsSection.classList.add('hidden');

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            const totalPages = pdf.numPages;

            this.updateProgress(0, `Processing ${totalPages} pages...`);

            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const canvas = await this.renderPageToCanvas(page);
                const imageBlob = await this.canvasToJPGBlob(canvas);
                
                this.convertedImages.push({
                    blob: imageBlob,
                    url: URL.createObjectURL(imageBlob),
                    filename: `page_${pageNum}.jpg`
                });

                const progress = Math.round((pageNum / totalPages) * 100);
                this.updateProgress(progress, `Converted page ${pageNum} of ${totalPages}`);
            }

            this.hideProgress();
            this.displayResults();
            
        } catch (error) {
            console.error('Error converting PDF:', error);
            this.showError('Error converting PDF. Please try again.');
        }
    }

    async renderPageToCanvas(page) {
        const scale = 2; // Higher scale for better quality
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        await page.render(renderContext).promise;
        return canvas;
    }

    async canvasToJPGBlob(canvas) {
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', 0.95); // High quality JPG
        });
    }

    displayResults() {
        this.imagesContainer.innerHTML = '';
        
        this.convertedImages.forEach((image, index) => {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'flex items-center justify-between p-4 border rounded-lg fade-in';
            
            imageContainer.innerHTML = `
                <div class="flex items-center space-x-4">
                    <img src="${image.url}" alt="Page ${index + 1}" class="w-16 h-20 object-cover rounded shadow">
                    <div>
                        <h4 class="font-semibold text-gray-800">${image.filename}</h4>
                        <p class="text-sm text-gray-600">Page ${index + 1}</p>
                    </div>
                </div>
                <button class="download-btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300" data-index="${index}">
                    <i class="fas fa-download mr-2"></i>
                    Download
                </button>
            `;
            
            this.imagesContainer.appendChild(imageContainer);
        });

        // Add download event listeners
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.download-btn').dataset.index);
                this.downloadImage(index);
            });
        });

        this.resultsSection.classList.remove('hidden');
    }

    downloadImage(index) {
        const image = this.convertedImages[index];
        const link = document.createElement('a');
        link.href = image.url;
        link.download = image.filename;
        link.click();
    }

    downloadAllImages() {
        this.convertedImages.forEach((image, index) => {
            setTimeout(() => {
                this.downloadImage(index);
            }, index * 100); // Stagger downloads
        });
    }

    showProgress() {
        this.progressSection.classList.remove('hidden');
        this.progressSection.classList.add('fade-in');
    }

    hideProgress() {
        this.progressSection.classList.add('hidden');
    }

    updateProgress(percentage, message) {
        this.progressBar.style.width = `${percentage}%`;
        this.progressText.textContent = `${percentage}%`;
        this.processingText.textContent = message;
    }

    showError(message) {
        this.hideProgress();
        alert(message);
    }
}

// Image to PDF Converter Class
class ImageToPDFConverter {
    constructor() {
        this.uploadArea = document.getElementById('imageUploadArea');
        this.fileInput = document.getElementById('imageFileInput');
        this.previewSection = document.getElementById('imagePreviewSection');
        this.previewContainer = document.getElementById('imagePreviewContainer');
        this.convertBtn = document.getElementById('convertToPdfBtn');
        this.progressSection = document.getElementById('imageProgressSection');
        this.progressBar = document.getElementById('imageProgressBar');
        this.progressText = document.getElementById('imageProgressText');
        this.processingText = document.getElementById('imageProcessingText');
        this.resultsSection = document.getElementById('imageResultsSection');
        this.downloadBtn = document.getElementById('downloadPdfBtn');
        this.selectedImages = [];
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelection(e));
        this.convertBtn.addEventListener('click', () => this.convertToPDF());
        this.downloadBtn.addEventListener('click', () => this.downloadPDF());
    }

    handleFileSelection(e) {
        const files = Array.from(e.target.files);
        this.selectedImages = files.filter(file => file.type.startsWith('image/'));
        this.displayImagePreviews();
    }

    displayImagePreviews() {
        this.previewContainer.innerHTML = '';
        this.selectedImages.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'w-full h-32 object-cover rounded-lg shadow';
                img.alt = `Image ${index + 1}`;
                this.previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
        this.previewSection.classList.remove('hidden');
    }

    async convertToPDF() {
        if (this.selectedImages.length === 0) return;

        this.showProgress();
        this.resultsSection.classList.add('hidden');

        try {
            const { jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
            const pdf = new jsPDF();

            for (let i = 0; i < this.selectedImages.length; i++) {
                const file = this.selectedImages[i];
                const img = await this.loadImage(file);
                
                if (i > 0) pdf.addPage();
                
                const imgWidth = pdf.internal.pageSize.getWidth();
                const imgHeight = pdf.internal.pageSize.getHeight();
                pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);

                const progress = Math.round(((i + 1) / this.selectedImages.length) * 100);
                this.updateProgress(progress, `Processing image ${i + 1} of ${this.selectedImages.length}`);
            }

            this.pdfBlob = pdf.output('blob');
            this.hideProgress();
            this.resultsSection.classList.remove('hidden');
            
        } catch (error) {
            console.error('Error converting to PDF:', error);
            this.showError('Error converting images to PDF. Please try again.');
        }
    }

    loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    downloadPDF() {
        if (this.pdfBlob) {
            const url = URL.createObjectURL(this.pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'converted_images.pdf';
            link.click();
            URL.revokeObjectURL(url);
        }
    }

    showProgress() {
        this.progressSection.classList.remove('hidden');
    }

    hideProgress() {
        this.progressSection.classList.add('hidden');
    }

    updateProgress(percentage, message) {
        this.progressBar.style.width = `${percentage}%`;
        this.progressText.textContent = `${percentage}%`;
        this.processingText.textContent = message;
    }

    showError(message) {
        this.hideProgress();
        alert(message);
    }
}

// PDF Resizer Class
class PDFResizer {
    constructor() {
        this.uploadArea = document.getElementById('pdfResizerUploadArea');
        this.fileInput = document.getElementById('pdfResizerFileInput');
        this.sizeOptions = document.getElementById('pdfSizeOptions');
        this.widthInput = document.getElementById('pdfWidth');
        this.heightInput = document.getElementById('pdfHeight');
        this.resizeBtn = document.getElementById('resizePdfBtn');
        this.progressSection = document.getElementById('pdfResizerProgressSection');
        this.progressBar = document.getElementById('pdfResizerProgressBar');
        this.progressText = document.getElementById('pdfResizerProgressText');
        this.processingText = document.getElementById('pdfResizerProcessingText');
        this.resultsSection = document.getElementById('pdfResizerResultsSection');
        this.downloadBtn = document.getElementById('downloadResizedPdfBtn');
        this.pdfFile = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelection(e));
        this.resizeBtn.addEventListener('click', () => this.resizePDF());
        this.downloadBtn.addEventListener('click', () => this.downloadResizedPDF());
    }

    handleFileSelection(e) {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            this.pdfFile = file;
            this.sizeOptions.classList.remove('hidden');
        }
    }

    async resizePDF() {
        if (!this.pdfFile) return;

        const newWidth = parseInt(this.widthInput.value);
        const newHeight = parseInt(this.heightInput.value);

        if (!newWidth || !newHeight) {
            alert('Please enter valid width and height values.');
            return;
        }

        this.showProgress();

        try {
            const arrayBuffer = await this.pdfFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            const { jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
            
            const newPdf = new jsPDF({
                orientation: newWidth > newHeight ? 'landscape' : 'portrait',
                unit: 'px',
                format: [newWidth, newHeight]
            });

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const canvas = await this.renderPageToCanvas(page, newWidth, newHeight);
                
                if (pageNum > 1) newPdf.addPage();
                newPdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, newWidth, newHeight);

                const progress = Math.round((pageNum / pdf.numPages) * 100);
                this.updateProgress(progress, `Resizing page ${pageNum} of ${pdf.numPages}`);
            }

            this.resizedPdfBlob = newPdf.output('blob');
            this.hideProgress();
            this.resultsSection.classList.remove('hidden');
            
        } catch (error) {
            console.error('Error resizing PDF:', error);
            this.showError('Error resizing PDF. Please try again.');
        }
    }

    async renderPageToCanvas(page, width, height) {
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(width / viewport.width, height / viewport.height);
        const scaledViewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;

        const renderContext = {
            canvasContext: context,
            viewport: scaledViewport
        };

        await page.render(renderContext).promise;
        return canvas;
    }

    downloadResizedPDF() {
        if (this.resizedPdfBlob) {
            const url = URL.createObjectURL(this.resizedPdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'resized_document.pdf';
            link.click();
            URL.revokeObjectURL(url);
        }
    }

    showProgress() {
        this.progressSection.classList.remove('hidden');
    }

    hideProgress() {
        this.progressSection.classList.add('hidden');
    }

    updateProgress(percentage, message) {
        this.progressBar.style.width = `${percentage}%`;
        this.progressText.textContent = `${percentage}%`;
        this.processingText.textContent = message;
    }

    showError(message) {
        this.hideProgress();
        alert(message);
    }
}

// Image Resizer Class
class ImageResizer {
    constructor() {
        this.uploadArea = document.getElementById('imageResizerUploadArea');
        this.fileInput = document.getElementById('imageResizerFileInput');
        this.sizeOptions = document.getElementById('imageSizeOptions');
        this.widthInput = document.getElementById('imageWidth');
        this.heightInput = document.getElementById('imageHeight');
        this.resizeBtn = document.getElementById('resizeImageBtn');
        this.progressSection = document.getElementById('imageResizerProgressSection');
        this.progressBar = document.getElementById('imageResizerProgressBar');
        this.progressText = document.getElementById('imageResizerProgressText');
        this.processingText = document.getElementById('imageResizerProcessingText');
        this.resultsSection = document.getElementById('imageResizerResultsSection');
        this.previewImg = document.getElementById('resizedImagePreview');
        this.downloadBtn = document.getElementById('downloadResizedImageBtn');
        this.imageFile = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelection(e));
        this.resizeBtn.addEventListener('click', () => this.resizeImage());
        this.downloadBtn.addEventListener('click', () => this.downloadResizedImage());
    }

    handleFileSelection(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.imageFile = file;
            this.sizeOptions.classList.remove('hidden');
        }
    }

    async resizeImage() {
        if (!this.imageFile) return;

        const newWidth = parseInt(this.widthInput.value);
        const newHeight = parseInt(this.heightInput.value);

        if (!newWidth || !newHeight) {
            alert('Please enter valid width and height values.');
            return;
        }

        this.showProgress();

        try {
            const img = await this.loadImage(this.imageFile);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = newWidth;
            canvas.height = newHeight;
            
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            this.updateProgress(50, 'Processing image...');
            
            canvas.toBlob((blob) => {
                this.resizedImageBlob = blob;
                this.previewImg.src = canvas.toDataURL();
                this.hideProgress();
                this.resultsSection.classList.remove('hidden');
            }, this.imageFile.type, 0.9);
            
        } catch (error) {
            console.error('Error resizing image:', error);
            this.showError('Error resizing image. Please try again.');
        }
    }

    loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    downloadResizedImage() {
        if (this.resizedImageBlob) {
            const url = URL.createObjectURL(this.resizedImageBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `resized_${this.imageFile.name}`;
            link.click();
            URL.revokeObjectURL(url);
        }
    }

    showProgress() {
        this.progressSection.classList.remove('hidden');
    }

    hideProgress() {
        this.progressSection.classList.add('hidden');
    }

    updateProgress(percentage, message) {
        this.progressBar.style.width = `${percentage}%`;
        this.progressText.textContent = `${percentage}%`;
        this.processingText.textContent = message;
    }

    showError(message) {
        this.hideProgress();
        alert(message);
    }
}
