import React, { useState, useRef } from 'react';
import "../../css/Git.css"

interface GitButtonProps {
  projectPath: string;
  onGitPullComplete: () => void;
}

const GitPullButton: React.FC<GitButtonProps> = ({ projectPath, onGitPullComplete }) => {
  const handleGitPull = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/execFeature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feature: 'PULL',
          params: [],
          project: projectPath,
        }),
      });
      const data = await response.json();
      console.log(data);

      onGitPullComplete();
    } catch (error) {
      console.error('Error executing git pull:', error);
    }
  };

  return <div onClick={handleGitPull}>Git Pull</div>;
};

export { GitPullButton };

