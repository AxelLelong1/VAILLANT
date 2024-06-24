interface FileBarProps {
    openFiles: string[];
    onFileOpen: (filePath: string) => void;
    onFileSwitch: (filePath: string) => void;
    activeFile: string | null;
}

const FileBarComponent: React.FC<FileBarProps> = ({ openFiles, onFileOpen, onFileSwitch, activeFile }) => {
    // Le reste de votre implémentation
};

export default FileBarComponent;
