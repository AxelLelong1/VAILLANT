import React, { useState/*, useEffect*/ } from 'react';
import FileTree from './FileTree';
import FileSelectionButton from './OpenFolder';
import FileCreationButton from './NewFile'
import EditorComponent from './CodeEditor';
import { useTranslation } from 'react-i18next';
import './translation';
import Terminal from './Terminal';
import { GitAddButton, GitCommitButton, GitPushButton } from './Git';

import "../css/IDE.css"
import "../css/arbo.css"
import "../css/code.css"
import "../css/files_bar.css"
import "../css/task_bar.css"
import "../css/terminal.css"
import FileBarComponent from './FileBar';

const App: React.FC = () => {

    const [selectedFolderPath, setSelectedFolderPath] = useState<string>('');
    //const [aspects, setAspects] = useState<string[]>([]);
    const { t, i18n } = useTranslation();

    function handleFolderSelect(folderPath: string) {
      setSelectedFolderPath(folderPath);
    }
    
    const handleFileCreation = () => {
    };

    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
    };

    
    let gitAspect = false;
/*
    async function getAspects() {
        try {
          const response = await fetch('http://localhost:8080/api/getAspects', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
        
          const data = await response.json();
          console.log(data);
          return data.aspects.slice(' ');
        } catch (error) {
          console.error('Error fetching aspects:', error);
        } 
    };

    
    const value = await getAspects();
    console.log(value);
    setAspects(getAspects.toString().slice(' '));
    gitAspect = aspects.includes("GIT");
    */

    return (
    <div>
        {/* Task bar */}
        <div className="task-bar">
        <nav className="nav">
          <ul className="nav__menu">
            <li className="nav__menu-item">
              <a>{t('File')}</a>
              <ul className="nav__submenu">
                <li className="nav__submenu-item ">
                  <a><FileCreationButton onFileCreation={handleFileCreation}/></a>
                </li>

                <li className="nav__submenu-item ">
                  <a>{t('Open')}</a>
                </li>

                <li className="nav__submenu-item ">
                    <a><FileSelectionButton onFolderSelect={handleFolderSelect}/></a>
                </li>

                <li className="nav__submenu-item ">
                  <a>{t('Save')}</a>
                </li>
                <li className="nav__submenu-item ">
                  <a>{t('SaveAs')}</a>
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

            <li className="nav__menu-item" aria-disabled={!gitAspect}>
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

        <div className="ligne"></div>

        {/* Main IDE layout */}
        <div className="ide-container">
        {/* Files handling pane */}
        <div className="files-pane">
            {selectedFolderPath && <FileTree folderPath={selectedFolderPath} />}
        </div>

        <div className="ruby-pane">
            {/* Open files list */}
            <FileBarComponent/>

            <EditorComponent />

            {/* Bottom pane for terminal, logs, etc. */}
            <div className="bottom-pane">
            <div className="tabbed-pane">
                <div className="tab-active" id="terminal-tab">{t('Terminal')}</div>
                <div className="tab" id="errors-tab">{t('Errors')}</div>
                <div className="tab" id="output-tab">{t('Output')}</div>
            </div>
            <div className="tab-content active" id="terminal-content">
              <Terminal />
            </div>
            <div className="tab-content" id="errors-content">
                <ul id="errors-list"></ul>
            </div>
            <div className="tab-content" id="output-content">
                <pre id="output-display"></pre>
            </div>
            </div>
        </div>
        </div>
    </div>
    );
};



export default App;