// DOM Elements
const elements = {
  cloudTab: document.getElementById('cloudTab'),
  localTab: document.getElementById('localTab'),
  fileGrid: document.getElementById('fileGrid'),
  fileUpload: document.getElementById('fileUpload'),
  queueStatus: document.getElementById('queueStatus'),
  downloadQueueCard: document.getElementById('downloadQueueCard'),
  toggleQueueBtn: document.getElementById('toggleQueueBtn'),
  queueContent: document.getElementById('queueContent'),
};

// Data
let cloudData = [];
let localData = [];
let currentTab = 'cloud';
let downloadQueue = [];

// Fetch Helpers
const fetchData = async (url) => {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
    });
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    return [];
  }
};

const updateCloudData = async () => {
  cloudData = await fetchData('http://localhost:8080/list');
  updateFileGrid();
};

const updateLocalData = async () => {
  localData = await fetchData('http://localhost:8080/downloaded');
  updateFileGrid();
};

// File Grid Rendering
const renderFileElement = (file) => {
  const fileElement = document.createElement('div');
  fileElement.className = 'h-40 flex items-end w-full border-2 rounded-md bg-blue-50/80';

  const sizeDisplay = file.size_readable || `${file.size} B`;
  const actionButton =
    currentTab === 'cloud'
      ? `<button class="text-blue-600 hover:text-blue-800" onclick="addToDownloadQueue(${file.id})">
           <i class="ri-download-line"></i>
         </button>`
      : `<button class="text-blue-600 hover:text-blue-800" onclick="downloadFile(${file.file_id}, '${file.filename}')">
           <i class="ri-download-line"></i>
         </button>`;
  const statusLabel =
    currentTab === 'cloud'
      ? `<span class="text-sm ${file.is_uploaded ? 'text-green-500' : 'text-yellow-500'}">
           ${file.is_uploaded ? 'Uploaded' : 'Uploading...'}
         </span>`
      : `<span class="text-sm ${file.is_downloaded ? 'text-green-500' : 'text-yellow-500'}">
           ${file.is_downloaded ? 'Downloaded' : 'Downloading...'}
         </span>`;

  fileElement.innerHTML = `
    <div class="bg-white p-4 rounded shadow flex flex-col w-full gap-2">
      <div class="flex justify-between w-full">
        <div class="flex items-center space-x-2">
          <i class="ri-file-text-line text-blue-500"></i>
          <span class="font-medium">${file.filename}</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500">${sizeDisplay}</span>
          ${actionButton}
        </div>
      </div>
      ${statusLabel}
    </div>`;
  return fileElement;
};

const updateFileGrid = () => {
  elements.fileGrid.innerHTML = '';
  const data = currentTab === 'cloud' ? cloudData : localData;
  data.forEach((file) => {
    elements.fileGrid.appendChild(renderFileElement(file));
  });
};

// Queue Management
const updateQueueStatus = () => {
  elements.queueStatus.textContent = downloadQueue.length
    ? `${downloadQueue.length} file(s) in download queue`
    : 'No downloads in progress';
};

const updateDownloadQueue = () => {
  elements.queueContent.innerHTML = '';
  downloadQueue.forEach((file) => {
    const queueItem = document.createElement('div');
    queueItem.className = 'p-2 border-b';
    queueItem.innerHTML = `
      <div class="flex justify-between items-center mb-1">
        <span class="text-sm font-medium">${file.filename}</span>
        <span class="text-xs text-gray-500">${file.progress}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${file.progress}%"></div>
      </div>`;
    elements.queueContent.appendChild(queueItem);
  });
};

const addToDownloadQueue = async (fileId) => {
  const file = cloudData.find((f) => f.id === fileId);
  if (!file) return;

  downloadQueue.push({ ...file, progress: 0 });
  updateQueueStatus();
  updateDownloadQueue();

  try {
    const downloadResponse = await fetch(`http://localhost:8080/download/${fileId}`);
    const data = await downloadResponse.json();
    if (data.status === 'downloaded') {
      updateLocalData();
    }
  } catch (error) {
    console.error('Error adding to download queue:', error);
  }
};

// Tab Switching
const switchTab = (tab) => {
  currentTab = tab;
  const isCloud = tab === 'cloud';
  elements.cloudTab.classList.toggle('active', isCloud);
  elements.localTab.classList.toggle('active', !isCloud);
  isCloud ? updateCloudData() : updateLocalData();
};

elements.cloudTab.addEventListener('click', () => switchTab('cloud'));
elements.localTab.addEventListener('click', () => switchTab('local'));

// File Upload
elements.fileUpload.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    await fetch('http://localhost:8080/upload', { method: 'POST', body: formData });
    updateCloudData();
  } catch (error) {
    console.error('File upload failed:', error);
  }
});

// Toggle Queue Visibility
elements.toggleQueueBtn.addEventListener('click', () => {
  elements.queueContent.classList.toggle('hidden');
  elements.toggleQueueBtn.innerHTML = elements.queueContent.classList.contains('hidden')
    ? '<i class="ri-arrow-up-s-line"></i>'
    : '<i class="ri-arrow-down-s-line"></i>';
});

// Auto-refresh
setInterval(() => {
  updateCloudData();
  updateLocalData();
}, 30000);

// Initial Load
updateCloudData();
updateQueueStatus();
updateDownloadQueue();
