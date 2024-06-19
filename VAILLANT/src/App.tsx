import React, { useState } from 'react';
import EditorComponent from './CodeEditor';

import "../css/IDE.css"
import "../css/arbo.css"
import "../css/code.css"
import "../css/files_bar.css"
import "../css/task_bar.css"
import "../css/terminal.css"

const App: React.FC = () => {

  return (
    <div>
        {/* Task bar */}
        <div className="task-bar">
        <button>File</button>
        <button>Edit</button>
        <button>Language</button>
        <button>Settings</button>
        </div>

        <div className="ligne"></div>

        {/* Main IDE layout */}
        <div className="ide-container">
        {/* Files handling pane */}
        <div className="files-pane">
            <div className="file-window">
            {/* File tree structure (example) */}
            <div className="file-tree">
                <ul>
                <li>Project
                    <ul>
                    <li>src
                        <ul>
                        <li>main.rb</li>
                        </ul>
                    </li>
                    <li>index.html</li>
                    <li>styles.css</li>
                    </ul>
                </li>
                </ul>
            </div>
            </div>
        </div>

        <div className="ruby-pane">
            {/* Open files list */}
            <div className="open-files-bar">
            <ul id="open-files-list">
                <li className="files-active">main.rb</li>
                <li>index.html</li>
                <li>styles.css</li>
                <li>app.js</li>
                <li>README.md</li>
            </ul>
            </div>

            <EditorComponent />

            {/* Bottom pane for terminal, logs, etc. */}
            <div className="bottom-pane">
            <div className="tabbed-pane">
                <div className="tab-active" id="terminal-tab">Terminal</div>
                <div className="tab" id="errors-tab">Errors</div>
                <div className="tab" id="output-tab">Output</div>
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