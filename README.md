XDrive

XDrive based in ZGSDrive is a cutting-edge, web-based file storage and sharing platform inspired by Google Drive. It leverages the decentralized power of the 0G Storage Network to ensure your files are securely stored, easily accessible, and efficiently managed.
Features

    Decentralized Secure Storage: XDrive uses the 0G decentralized network to protect your files from unauthorized access and ensure high availability.
    Google Drive-Like Interface: Enjoy a familiar and user-friendly interface for seamless file management and sharing.
    Effortless File Sharing: Share files with others by generating secure download links or inviting collaborators to access your files.
    Smart File Management: Organize files with intuitive features like creating folders, renaming files, and deleting unnecessary items.
    Efficient Upload and Download: Files are chunked, distributed, and reassembled using Merkle root hashing for fast, secure, and reliable operations.

Technologies Used

    Frontend: HTML, JavaScript, Tailwind CSS
    Backend: Go, Gin, SQLite
    Storage: 0G Storage Network

Backend Setup

    Copy the .env.example file to .env and configure the environment variables, including the private key for your wallet.

    Start the backend server:

    cp .env.example .env
    go run main.go

Frontend Setup

    Navigate to the frontend directory:

cd ui/xdrive-client

Install dependencies and start the development server:

    npm install
    npm run dev

Usage

    Open the frontend in your browser at http://localhost:5173.
    Upload, manage, and share your files seamlessly with the XDrive interface.

📤 Uploading and 📥 Downloading Files in XDrive
Uploading Files

    Navigate to the Cloud tab to upload files to the decentralized 0G storage network.
    XDrive breaks your files into chunks and securely distributes them across 0G’s decentralized nodes, ensuring redundancy and privacy.

Downloading Files

    Retrieve files from the decentralized storage by requesting a download. XDrive reassembles the chunks using Merkle root hashing, ensuring data integrity and security.

Local File Management

    Downloaded files appear in the Local tab, where you can access them offline. Files remain locally available until their expiration time (default: 1 hour). The background process cleans up expired files to optimize storage, while your data remains safe in the 0G network for future retrieval.

End-to-End Decentralized Storage Workflow

XDrive ensures a fully decentralized storage experience:

    File Upload: Files are chunked and distributed across 0G nodes.
    File Download: Data is reassembled on demand with full integrity verification.
    Local Tab Management: Access and manage locally stored files efficiently.
![Monitoring Image 2](https://github.com/GentlemenValidators/xDrive-0G/blob/main/Screenshot_3.png)


