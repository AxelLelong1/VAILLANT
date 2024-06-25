import React, { useState } from 'react';
import FileTree from './FileTree';
import FileSelectionButton from './OpenFolder';
import FileCreationButton from './NewFile'
import EditorComponent from './CodeEditor';

import "../css/IDE.css"
import "../css/arbo.css"
import "../css/code.css"
import "../css/files_bar.css"
import "../css/task_bar.css"
import "../css/terminal.css"
import FileBarComponent from './FileBar';

const App: React.FC = () => {

    const [selectedFolderPath, setSelectedFolderPath] = useState<string>('');
    const [selectTheme, setTheme] = useState<boolean>(true);
    const handleFolderSelect = (folderPath: string) => {
        setSelectedFolderPath(folderPath);
    };
    
    const handleFileCreation = () => {
    };
    
    const theme = () => {
      if (selectTheme)
        setTheme(false) 
      else
        setTheme(true)
  };

    return (
    <div>
        {/* Task bar */}
        <div className="task-bar">
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
                        <a>Français</a>
                    </li>
                    <li className="nav__submenu-item ">
                        <a>Lietuviškas</a>
                    </li>
                </ul>
            </li>
              <button className="nav__menu-item" onClick={theme}>
                  <a><img src={`/ImagesPing${selectTheme ? "/black.png" : "/white.png"}`} style= {{ width: '20px', height: '20px', margin: '0 2px' }} alt="Theme"/></a>
              </button>
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
                <div className="tab-active" id="terminal-tab">Terminal</div>
                <div className="tab" id="errors-tab">Erreurs</div>
                <div className="tab" id="output-tab">Sortie</div>
            </div>
            <div className="tab-content active" id="terminal-content">
                <pre id="terminal-output"></pre>
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