import React, { useCallback, useEffect, useState } from 'react';
import FileTree from './FileTree';
import FileSelectionButton from './OpenFolder';
import FileCreationButton from './NewFile';
import OuvrirSelectionInput from './Ouvrir';
import SaveButton from './Save';
import SaveAsButton from './SaveAs';

//import EditorComponent from './CodeEditor';
import AIComponent from './AI';
import FileBarComponent from './FileBar';
import MusicPlayer from './Music';


import { useTranslation } from 'react-i18next';
import './translation';
import Terminal from './Terminal';
import Output from './output';
import Error from './Errors';
import { GitAddButton, GitCommitButton, GitPushButton } from './Git';


import "../css/IDE.css"
import "../css/arbo.css"
import "../css/code.css"
import "../css/files_bar.css"
import "../css/task_bar.css"
import "../css/terminal.css"

import "../css/ai.css"

import { useTheme } from './ThemeContext';
import { aspects } from './Aspects';



const App: React.FC = () => {
  const { toggleTheme, isDarkMode } = useTheme();
  const [selectedFolderPath, setSelectedFolderPath] = useState<string>('');
  const [isAIMenuVisible, setIsAIMenuVisible] = useState<boolean>(false);
  const [openedFiles, setOpenedFiles] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const [isGitAspect, setIsGitAspect] = useState<boolean>(false);
  const [canfetch, setcanFetch] = useState<boolean>(false);
  const [/*aspectsList*/, setAspectsList] = useState<string[]>([]);

  const [fileContents, setFileContents] = useState<{ [key: string]: string }>({});
  const [output, setOutput] = useState<string>("");
  const [errors, setErrors] = useState<string>("");

  const [activeTab, setActiveTab] = useState<string>("terminal");

  useEffect(() => {
    console.log(canfetch);
    if (canfetch) {
        const fetchAspects = async () => {
            const asps = await aspects();
            setAspectsList(asps);
            setIsGitAspect(asps.includes('GIT'));
        };
        fetchAspects();
        setcanFetch(false);
    }
  }, [canfetch===true]);
  
  const { t, i18n } = useTranslation();

  const theme = () => {
    toggleTheme();
  };

  const handleFolderSelect = (folderPath: string) => {
      setSelectedFolderPath(folderPath);
  };
  
  //@ts-ignore
  const handleFileCreation = () => {
  };

  const toggleAIMenu = () => {
    setIsAIMenuVisible(!isAIMenuVisible);
  };

  const closeAIMenu = () => {
    setIsAIMenuVisible(false);
  };

  const handleFileClick = (filePath: string) => {
    if (!openedFiles.includes(filePath)) {
        setOpenedFiles([...openedFiles, filePath]);
    }
    setActiveFile(filePath);
  };

  const handleFileRemove = (filePath: string) => {
      setOpenedFiles(openedFiles.filter(file => file !== filePath));
      if (activeFile === filePath) {
          setActiveFile(openedFiles.length > 1 ? openedFiles[0] : null);
      }
  };

  const handleFileSelect = (filePath: string) => {
      setActiveFile(filePath);
  };

  const onFileTreeFetchComplete = useCallback(() => {
    console.log("callback");
    setcanFetch(true);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

    return (
    <div className={`${isDarkMode ? "dark-mode" : ""}`}>
        {/* Task bar */}
        <div className={`task-bar ${isDarkMode ? "dark" : ""}`}>
        <div className='left-menu'>
        <nav className="nav">
          <ul className="nav__menu">
            <li className="nav__menu-item">
              <a>{t('File')}</a>
              <ul className="nav__submenu">
                <li className="nav__submenu-item ">
                  <a><FileCreationButton onFileCreation={handleFileClick}/></a>
                </li>

                <li className="nav__submenu-item ">
                  <a><OuvrirSelectionInput onFolderSelect={handleFolderSelect} onFileSelect={handleFileClick}/></a>
                </li>

                <li className="nav__submenu-item ">
                    <a><FileSelectionButton onFolderSelect={handleFolderSelect}/></a>
                </li>

                <li className="nav__submenu-item ">
                  <a><SaveButton filePath={activeFile} filesContents={fileContents}/></a>
                </li>
                <li className="nav__submenu-item ">
                  <a><SaveAsButton filePath={activeFile} filesContents={fileContents}/></a>
                </li>
              </ul>
            </li>
            
            <li className="nav__menu-item">
              <a>{t('Edit')}</a>
              <ul className="nav__submenu">
                <li className="nav__submenu-item ">
                  <a>{t('Undo')}</a>
                </li>

                <li className="nav__submenu-item ">
                  <a>{t('Redo')}</a>
                </li>

                <li className="nav__submenu-item ">
                  <a>{t('Copy')}</a>
                </li>
                <li className="nav__submenu-item ">
                  <a>{t('Cut')}</a>
                </li>
                <li className="nav__submenu-item ">
                  <a>{t('Paste')}</a>
                </li>
                <li className="nav__submenu-item ">
                  <a>{t('Search')}</a>
                </li>
              </ul>
            </li>

            <li className={`nav__menu-item ${isGitAspect ? "" : "deactivate" }`}>
              <a>Git</a>
              <ul className="nav__submenu">
                <li className="nav__submenu-item ">
                  <a><GitAddButton projectPath={selectedFolderPath}/></a>
                </li>
                <li className="nav__submenu-item ">
                  <a><GitCommitButton projectPath={selectedFolderPath}/></a>
                </li>
                <li className="nav__submenu-item ">
                  <a><GitPushButton projectPath={selectedFolderPath}/></a>
                </li>
              </ul>
            </li>

            <li className="nav__menu-item">
                <a>{t('Language')}</a>
                <ul className="nav__submenu">
                    <li className="nav__submenu-item " onClick={() => changeLanguage('fr')}>
                        <a>{t('French')}</a>
                    </li>
                    <li className="nav__submenu-item " onClick={() => changeLanguage('lt')}>
                        <a>{t('Lithuanian')}</a>
                    </li>
                </ul>
            </li>
            </ul>
          </nav>
          </div>
            <div className="right-menu">
            <nav className="nav">
              <ul className="nav__menu">
              <button className="nav__menu-item" onClick={theme}>
                  <a><img src={`/ImagesPing${isDarkMode ? "/black.png" : "/white.png"}`} style= {{ width: '20px', height: '20px', margin: '0 2px' }} alt="Theme"/></a>
                </button>
                <li className="nav__menu-item">
                  <a onClick={toggleAIMenu}>AI</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className={`ligne ${isDarkMode ? "dark" : ""}`}></div>

        {/* Main IDE layout */}
        <div className="ide-container">
        {/* Files handling pane */}
        <div className={`files-pane ${isDarkMode ? "black" : ""}`}>
          <div className='filetree'>
            {selectedFolderPath && <FileTree folderPath={selectedFolderPath} onFileClick={handleFileClick} onFetchComplete={onFileTreeFetchComplete}/>}
          </div>
          <div className='MUSICA'>
            <MusicPlayer />
          </div>
        </div>

        

        <div className="ruby-pane">
            {/* Open files list */}
            <FileBarComponent
                        files={openedFiles}
                        onFileRemove={handleFileRemove}
                        onFileSelect={handleFileSelect}
                        activeFile={activeFile}
                        folderPath={selectedFolderPath}
                        filesContents={fileContents}
                        setFilesContents={setFileContents}
                        output={output}
                        setOutput={setOutput}
                        errors={errors}
                        setErrors={setErrors}
                    />

            {/* Bottom pane for terminal, logs, etc. */}
            <div className="bottom-pane">

            <div className={`tabbed-pane ${isDarkMode ? "dark" : ""}`}>
                <div className={`tab${activeTab === 'terminal' ? "-active" : ""} ${isDarkMode ? "dark" : ""}`} id="terminal-tab" onClick={() => handleTabClick('terminal')}>{t('Terminal')}</div>
                <div className={`tab${activeTab === 'errors' ? "-active" : ""} ${isDarkMode ? "dark" : ""}`} id="errors-tab" onClick={() => handleTabClick('errors')}>{t('Errors')}</div>
                <div className={`tab${activeTab === 'output' ? "-active" : ""} ${isDarkMode ? "dark" : ""}`} id="output-tab" onClick={() => handleTabClick('output')}>{t('Output')}</div>
            </div>
            <div className={`tab-content ${activeTab === 'terminal' ? "active" : ""} ${isDarkMode ? "dark" : ""}`} id="terminal-content">
                <Terminal />
            </div>
            <div className={`tab-content ${activeTab === 'errors' ? "active" : ""} ${isDarkMode ? "dark" : ""}`} id="errors-content">
                <Error errors={errors}/>
            </div>
            <div className={`tab-content ${activeTab === 'output' ? "active" : ""} ${isDarkMode ? "dark" : ""}`} id="output-content">
                <Output output={output}/>
            </div>
            </div>
          </div>
          <div className={`ai-menu ${isAIMenuVisible ? 'visible' : ''}`}>
            <AIComponent onClose={closeAIMenu} />
          </div>
        </div>
    </div>
    );
};



export default App;