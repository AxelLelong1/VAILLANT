import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import FileTree from './FileTree';
import FileSelectionButton from './OpenFolder';
import FileCreationButton from './NewFile';
import OuvrirSelectionInput from './Ouvrir';

import HelpMenuFr from './HelpMenuFr';
import SearchButton from './Search';
import SaveButton, {handleSave} from './Save';
import SaveAsButton, {handleSaveAs} from './SaveAs';
import { handleShortcutCopy, handleShortcutCut, handleShortcutPaste } from './ContentShortcutsComponent';


//import EditorComponent from './CodeEditor';
import AIComponent from './AI';
import FileBarComponent from './FileBar';
import MusicPlayer from './Music';


import { useTranslation } from 'react-i18next';
import './translation';
import Terminal from './Terminal';
import Output from './output';
import Error from './Errors';
import { GitAddButton, GitCommitButton, /*GitPushButton,*/ } from './Git/Git';
import { GitPullButton } from './Git/Gitpull';


import "../css/IDE.css"
import "../css/arbo.css"
import "../css/code.css"
import "../css/files_bar.css"
import "../css/task_bar.css"
import "../css/terminal.css"

import "../css/ai.css"

import { useTheme } from './ThemeContext';
import { aspects } from './Aspects';
import HelpMenuLith from './HelpMenuLith';
import FileShortcutsComponent from './FileShortcutsComponent';
import { monaco } from 'react-monaco-editor';



const App: React.FC = () => {
  const { toggleTheme, isDarkMode } = useTheme();
  const [selectedFolderPath, setSelectedFolderPath] = useState<string>('');
  const [isAIMenuVisible, setIsAIMenuVisible] = useState<boolean>(false);
  const [openedFiles, setOpenedFiles] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string|null>(null);
  const activeFileRef = useRef<string|null>(null);

  const [isGitAspect, setIsGitAspect] = useState<boolean>(false);
  const [canfetch, setcanFetch] = useState<boolean>(false);
  const [is_remove, setIsRemove] = useState<boolean>(false);
  const [aspectsList, setAspectsList] = useState<string[]>([]);
  const [gitPullComplete, setGitPullComplete] = useState<boolean>(false);

  const [heartsByFile, setHeartsByFile] = useState<{ [key: string]: number }>({});
  const [output, setOutput] = useState<string>("");
  const [errors, setErrors] = useState<string>("");

  const [activeTab, setActiveTab] = useState<string>("terminal");

  const [isHelpMenuVisibleFr, setIsHelpMenuVisibleFr] = useState<boolean>(false);
  const [isHelpMenuVisibleLith, setIsHelpMenuVisibleLith] = useState<boolean>(false);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const fileContentsRef = useRef<{ [key: string]: string }>({});
  

  useEffect(() => {
    activeFileRef.current = activeFile;
  }, [activeFile]);

  useEffect(() => {
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


  useEffect( () => {
      if (!activeFile)
          return;
      if (heartsByFile[activeFile] === 0)
      {
          handleFileRemove(activeFile);
          const remove = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/delete/folder', {
                  method: 'POST',
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ path: activeFile})
              });

              if (response.ok) {
                  setIsRemove(true);
              } else {
                  console.error('Failed to remove the file');
              }
          } catch (error) {
              console.error("Couldn't remove the selected file", error);
          }
        };
        remove();
        setIsRemove(false);
        //Afficher la grosse bombe (ici c'est l'endroit où le fichier a déjà été supprimé)
      }
  }, [heartsByFile]);
  
  const { t, i18n } = useTranslation();

  const theme = () => {
    toggleTheme();
  };

  const handleFolderSelect = (folderPath: string) => {
      setSelectedFolderPath(folderPath);
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

  const handleShortcutSave = () => {

    handleSave(fileContentsRef.current, activeFileRef.current);
  }

  const handleShortcutSaveAs = ()=> {    
    handleSaveAs(fileContentsRef.current, activeFileRef.current);
  }
  const handleFileSelect = (filePath: string) => {
    setActiveFile(filePath);
  };

  const onFileTreeFetchComplete = useCallback(() => {
    console.log("callback");
    setcanFetch(true);
  }, []);

  const onGitPullComplete = useCallback(() => {
    console.log("callback Git pull");
    setGitPullComplete(prev => !prev);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const toggleHelpMenuFr = () => {
    setIsHelpMenuVisibleFr(!isHelpMenuVisibleFr); // Toggle HelpMenu visibility
  };

  const closeHelpMenuFr = () => {
    setIsHelpMenuVisibleFr(false);
  };

  const toggleHelpMenuLith = () => {
    setIsHelpMenuVisibleLith(!isHelpMenuVisibleLith); // Toggle HelpMenu visibility
  };

  const closeHelpMenuLith = () => {
    setIsHelpMenuVisibleLith(false);
  };

    return (
    <div className={`${isDarkMode ? "dark-mode" : ""}`}>
      <FileShortcutsComponent onShortcutSave={handleShortcutSave} onShortcutSaveAs={handleShortcutSaveAs}/>
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
                      <a><SaveButton filePath={activeFile} filesContents={fileContentsRef.current}/></a>
                    </li>
                    <li className="nav__submenu-item ">
                      <a><SaveAsButton filePath={activeFile} filesContents={fileContentsRef.current}/></a>
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
                  <a onClick={() => handleShortcutCopy(editorRef.current)}>{t('Copy')}</a>
                </li>
                <li className="nav__submenu-item ">
                  <a onClick={() => handleShortcutCut(editorRef.current)}>{t('Cut')}</a>
                </li>
                <li className="nav__submenu-item ">
                  <a onClick={() => handleShortcutPaste(editorRef.current)}>{t('Paste')}</a>
                </li>
                <li className="nav__submenu-item ">
                <a><SearchButton folderPath={selectedFolderPath} output={output} setOutput={setOutput} errors={errors} setErrors={setErrors}/></a>
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
                    {/*<li className="nav__submenu-item ">
                      <a><GitPushButton projectPath={selectedFolderPath}/></a>
                    </li>*/}
                    <li className="nav__submenu-item ">
                      <a><GitPullButton projectPath={selectedFolderPath} onGitPullComplete={onGitPullComplete}/></a>
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
                
                <li className="nav__menu-item">
                  <a>{t('Help')}</a>
                  <ul className="nav__submenu">
                    <li className="nav__submenu-item " onClick={toggleHelpMenuFr}>
                      <a>{t('French')}</a>
                    </li>

                    <li className="nav__submenu-item " onClick={toggleHelpMenuLith}>
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
                  <a onClick={toggleAIMenu}>{t('AI')}</a>
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
            {selectedFolderPath && <FileTree folderPath={selectedFolderPath} onFileClick={handleFileClick} onFetchComplete={onFileTreeFetchComplete} onGitPullComplete={gitPullComplete} onFileRemove={handleFileRemove} is_remove={is_remove}/>}
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

                        heartsByFile={heartsByFile}
                        setHeartsByFile={setHeartsByFile}
                        output={output}
                        setOutput={setOutput}
                        errors={errors}
                        setErrors={setErrors}
                        filesContents={fileContentsRef.current}
                        editorRefProps={editorRef.current}
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
          {isHelpMenuVisibleFr && <HelpMenuFr onClose={closeHelpMenuFr} isHelpMenuVisible={isHelpMenuVisibleFr}/>}
          {isHelpMenuVisibleLith && <HelpMenuLith onClose={closeHelpMenuLith} isHelpMenuVisible={isHelpMenuVisibleLith}/>}
        </div>
    </div>
    );
};



export default App;