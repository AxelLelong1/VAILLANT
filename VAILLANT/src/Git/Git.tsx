import React, { useState, useRef } from 'react';
import "../../css/Git.css"
import { useTranslation } from 'react-i18next';

interface GitButtonProps {
  projectPath: string;
}

const GitAddButton: React.FC<GitButtonProps> = ({ projectPath }) => {
    const { t } = useTranslation();
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      setSelectedFiles(files.map(file => file.name)); // assuming you need only the file names
    };

    const handleGitAdd = async () => {
        console.log(selectedFiles);
        try {
        const response = await fetch('http://localhost:8080/api/execFeature', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              feature: 'ADD',
              params: selectedFiles,
              project: projectPath
            })
          });
        const data = await response.json();
        console.log(data);
        setSelectedFiles([]);
        } catch (error) {
            console.error('Error executing git add:', error);
        }
    };

    return (
        <div>
            <div className="btn-wide" onClick={() => fileInputRef.current?.click()}>{t('ChooseFiles')}</div>
            <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileSelection}
            />
            <div onClick={handleGitAdd}>Git Add {selectedFiles.length} {t('files')}</div>
        </div>
      );
};

const GitCommitButton: React.FC<GitButtonProps> = ({ projectPath }) => {
  const handleGitCommit = async () => {
    const commitMessage = prompt('Enter commit message:');
    if (!commitMessage) return;

    try {
      const response = await fetch('http://localhost:8080/api/execFeature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feature: 'COMMIT',
          params: [commitMessage],
          project: projectPath
        })
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error executing git commit:', error);
    }
  };

  return <div onClick={handleGitCommit}>Git Commit</div>;
};
/*
const GitPushButton: React.FC<GitButtonProps> = ({ projectPath }) => {
  const handleGitPush = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/execFeature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feature: 'PUSH',
          params: [],
          project: projectPath,
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error executing git push:', error);
    }
  };

  return <div onClick={handleGitPush}>Git Push</div>;
};
*/

export { GitAddButton, GitCommitButton, /*GitPushButton,*/ };
