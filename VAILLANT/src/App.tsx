import React, { useState } from 'react';
import FileTree from './FileTree';
import FileSelectionButton from './OpenFolder';
import FileCreationButton from './NewFile'
import EditorComponent from './CodeEditor';
import AIComponent from './AI';
import FileBarComponent from './FileBar';

import "../css/IDE.css"
import "../css/arbo.css"
import "../css/code.css"
import "../css/files_bar.css"
import "../css/task_bar.css"
import "../css/terminal.css"

import "../css/ai.css"

import { useTheme } from './ThemeContext';



const App: React.FC = () => {
  const { toggleTheme, isDarkMode } = useTheme();

  const theme = () => {
    toggleTheme();
  };
    const [selectedFolderPath, setSelectedFolderPath] = useState<string>('');
    const [isAIMenuVisible, setIsAIMenuVisible] = useState<boolean>(false);

    const handleFolderSelect = (folderPath: string) => {
        setSelectedFolderPath(folderPath);
    };
    const handleFileCreation = () => {
    };

    const toggleAIMenu = () => {
      setIsAIMenuVisible(!isAIMenuVisible);
    };

    const closeAIMenu = () => {
      setIsAIMenuVisible(false);
    };
    
    return (
    <div className={`${isDarkMode ? "dark-mode" : ""}`}>
        {/* Task bar */}
        <div className={`task-bar ${isDarkMode ? "dark" : ""}`}>
        <div className='left-menu'>
        <nav className="nav">
          <ul className="nav__menu">
            <li className="nav__menu-item">
              <a>Fichier</a>
              <ul className="nav__submenu">
                <li className="nav__submenu-item ">
                  <a><FileCreationButton onFileCreation={handleFileCreation}/></a>
                </li>

                <li className="nav__submenu-item ">
                  <a>Ouvrir ...</a>
                </li>

                <li className="nav__submenu-item ">
                    <a><FileSelectionButton onFolderSelect={handleFolderSelect}/></a>
                </li>

                <li className="nav__submenu-item ">
                  <a>Sauvegarder</a>
                </li>
                <li className="nav__submenu-item ">
                  <a>Sauvegarder sous ...</a>
                </li>
              </ul>
            </li>
            
            <li className="nav__menu-item">
              <a>Edition</a>
              <ul className="nav__submenu">
                <li className="nav__submenu-item ">
                  <a>Annuler</a>
                </li>

                <li className="nav__submenu-item ">
                  <a>Rétablir</a>
                </li>

                <li className="nav__submenu-item ">
                  <a>Copier</a>
                </li>
                <li className="nav__submenu-item ">
                  <a>Couper</a>
                </li>
                <li className="nav__submenu-item ">
                  <a>Coller</a>
                </li>
                <li className="nav__submenu-item ">
                  <a>Rechercher</a>
                </li>
              </ul>
            </li>

            <li className="nav__menu-item">
                <a>Langage</a>
                <ul className="nav__submenu">
                  <li className="nav__submenu-item ">
                    <a><FileCreationButton onFileCreation={handleFileCreation}/></a>
                  </li>

                  <li className="nav__submenu-item ">
                    <a>Ouvrir ...</a>
                  </li>

                  <li className="nav__submenu-item ">
                      <a><FileSelectionButton onFolderSelect={handleFolderSelect}/></a>
                  </li>

                  <li className="nav__submenu-item ">
                    <a>Sauvegarder</a>
                  </li>
                  <li className="nav__submenu-item ">
                    <a>Sauvegarder sous ...</a>
                  </li>
                </ul>
              </li>
              
              <li className="nav__menu-item">
                <a>Edition</a>
                <ul className="nav__submenu">
                  <li className="nav__submenu-item ">
                    <a>Annuler</a>
                  </li>

                  <li className="nav__submenu-item ">
                    <a>Rétablir</a>
                  </li>

                  <li className="nav__submenu-item ">
                    <a>Copier</a>
                  </li>
                  <li className="nav__submenu-item ">
                    <a>Couper</a>
                  </li>
                  <li className="nav__submenu-item ">
                    <a>Coller</a>
                  </li>
                  <li className="nav__submenu-item ">
                    <a>Rechercher</a>
                  </li>
                </ul>
              </li>

              <li className="nav__menu-item">
                  <a>Langage</a>
                  <ul className="nav__submenu">
                      <li className="nav__submenu-item ">
                          <a>Français</a>
                      </li>
                      <li className="nav__submenu-item ">
                          <a>Lietuviškas</a>
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
            {selectedFolderPath && <FileTree folderPath={selectedFolderPath} />}
            <div className='MUSICA'><p>MUSIQUE</p></div>
        </div>

        

        <div className="ruby-pane">
            {/* Open files list */}
            <FileBarComponent />

            <EditorComponent />

            {/* Bottom pane for terminal, logs, etc. */}
            <div className="bottom-pane">
            <div className={`tabbed-pane ${isDarkMode ? "dark" : ""}`}>
                <div className={`tab-active ${isDarkMode ? "dark" : ""}`} id="terminal-tab">Terminal</div>
                <div className={`tab ${isDarkMode ? "dark" : ""}`} id="errors-tab">Erreurs</div>
                <div className={`tab ${isDarkMode ? "dark" : ""}`} id="output-tab">Sortie</div>
            </div>
            <div className={`tab-content active ${isDarkMode ? "dark" : ""}`} id="terminal-content">
                <pre id="terminal-output"></pre>
            </div>
            <div className={`tab-content ${isDarkMode ? "dark" : ""}`} id="errors-content">
                <ul id="errors-list"></ul>
            </div>
            <div className={`tab-content ${isDarkMode ? "dark" : ""}`} id="output-content">
                <pre id="output-display"></pre>
            </div>
            </div>
          </div>
          <div className={`ai-menu ${isAIMenuVisible ? 'visible' : ''}`}>
            <AIComponent onClose={closeAIMenu} setText={() => {}} />
          </div>
        </div>
    </div>
    );
};



export default App;