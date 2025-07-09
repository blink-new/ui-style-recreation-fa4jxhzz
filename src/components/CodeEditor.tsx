import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Home, 
  Code, 
  FolderOpen, 
  Play, 
  Paperclip, 
  Save, 
  FileText, 
  X, 
  Plus, 
  Trash2,
  Settings,
  FileOpen
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileItem[];
  collapsed?: boolean;
}

interface Tab {
  id: string;
  name: string;
  content: string;
  isModified: boolean;
  isActive: boolean;
}

interface LineInfo {
  number: number;
  content: string;
  isFoldable: boolean;
  isFolded: boolean;
  indentLevel: number;
}

const CodeEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('tab1');
  const [foldedLines, setFoldedLines] = useState<Set<number>>(new Set([3300, 3308, 3314, 3322]));
  
  const [tabs] = useState<Tab[]>([
    {
      id: 'tab1',
      name: 'Tab 1',
      content: `function updateColors(color, ctype)
    elseif ctype == text1 then
        currentText1 = color
    elseif ctype == text2 then
        for i,v in pairs(text2) do
            v.TextColor3 = color
        end
        currentText2 = color
    elseif ctype == scroll then
        for i,v in pairs(scroll) do
            v.ScrollBarImageColor3 = color
        end
        currentScroll = color
    end
end

local colorpickerOpen = false
ColorsButton.MouseButton1Click:Connect(function()
    cache_currentShade1 = currentShade1
    cache_currentShade2 = currentShade2`,
      isModified: true,
      isActive: true
    }
  ]);

  const [files] = useState<FileItem[]>([
    {
      id: 'scripts',
      name: 'Scripts',
      type: 'folder',
      collapsed: false,
      children: [
        {
          id: 'fly',
          name: 'fly.txt',
          type: 'file',
          content: 'fly script content...'
        },
        {
          id: 'game-scripts',
          name: 'Game Scripts',
          type: 'folder',
          collapsed: false,
          children: [
            {
              id: 'adoptme',
              name: 'AdoptMe.txt',
              type: 'file',
              content: 'adopt me script content...'
            }
          ]
        }
      ]
    }
  ]);

  const toggleFold = (lineNumber: number) => {
    setFoldedLines(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lineNumber)) {
        newSet.delete(lineNumber);
      } else {
        newSet.add(lineNumber);
      }
      return newSet;
    });
  };

  const parseCodeLines = (content: string): LineInfo[] => {
    const lines = content.split('\n');
    const baseLineNumber = 3284;
    
    return lines.map((line, index) => {
      const lineNumber = baseLineNumber + index;
      const trimmedLine = line.trim();
      const indentLevel = (line.length - line.trimStart().length) / 4;
      
      const isFoldable = trimmedLine.includes('elseif') || trimmedLine.includes('for') || trimmedLine.includes('function') || trimmedLine.includes('Connect(');
      
      return {
        number: lineNumber,
        content: line,
        isFoldable,
        isFolded: foldedLines.has(lineNumber),
        indentLevel
      };
    });
  };

  const renderSyntaxHighlighting = (code: string) => {
    return code
      .replace(/\b(function|local|elseif|then|end|for|in|pairs|do|if)\b/g, '<span style="color: #569cd6;">$1</span>')
      .replace(/\b(updateColors|MouseButton1Click|Connect|TextColor3|ScrollBarImageColor3)\b/g, '<span style="color: #4ec9b0;">$1</span>')
      .replace(/\b(color|ctype|text1|text2|scroll|currentText1|currentText2|currentScroll|currentShade1|currentShade2|cache_currentShade1|cache_currentShade2|colorpickerOpen|ColorsButton|i|v)\b/g, '<span style="color: #d4d4d4;">$1</span>')
      .replace(/(".*?")/g, '<span style="color: #ce9178;">$1</span>')
      .replace(/(==|=)/g, '<span style="color: #d4d4d4;">$1</span>')
      .replace(/\b(false|true)\b/g, '<span style="color: #569cd6;">$1</span>')
      .replace(/\b(\d+)\b/g, '<span style="color: #b5cea8;">$1</span>');
  };

  const renderFileTree = (items: FileItem[], depth = 0) => {
    return items.map((item) => (
      <div key={item.id} className="select-none">
        <div 
          className="flex items-center py-0.5 px-2 hover:bg-[#2a2d2e] cursor-pointer text-sm"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {item.type === 'folder' && (
            <span className="mr-1 text-gray-400">
              {item.collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </span>
          )}
          {item.type === 'folder' ? (
            <FolderOpen className="w-4 h-4 mr-2 text-[#dcb67a]" />
          ) : (
            <FileText className="w-4 h-4 mr-2 text-[#519aba]" />
          )}
          <span className="text-[#cccccc]">{item.name}</span>
        </div>
        {item.type === 'folder' && !item.collapsed && item.children && (
          <div>
            {renderFileTree(item.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);
  const codeLines = currentTab ? parseCodeLines(currentTab.content) : [];

  return (
    <div className="w-full h-screen bg-[#1e1e1e] flex flex-col font-mono text-sm overflow-hidden">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-12 bg-[#333333] border-r border-[#464647] flex flex-col items-center py-3">
          <div className="p-2 rounded hover:bg-[#464647] cursor-pointer mb-2">
            <Home className="w-5 h-5 text-[#cccccc]" />
          </div>
          <div className="p-2 rounded bg-[#007acc] cursor-pointer mb-2">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div className="mt-auto p-2 rounded hover:bg-[#464647] cursor-pointer">
            <Settings className="w-5 h-5 text-[#cccccc]" />
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="bg-[#2d2d30] border-b border-[#464647] flex items-center">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`px-4 py-2 border-r border-[#464647] flex items-center cursor-pointer hover:bg-[#1e1e1e] ${
                  tab.isActive ? 'bg-[#1e1e1e] text-[#cccccc]' : 'bg-[#2d2d30] text-[#969696]'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="mr-2">{tab.name}</span>
                {tab.isModified && <span className="text-[#969696] mr-2">*</span>}
                <X className="w-3 h-3 text-[#969696] hover:text-[#cccccc]" />
              </div>
            ))}
            <div className="px-2 py-2 cursor-pointer hover:bg-[#1e1e1e]">
              <Plus className="w-4 h-4 text-[#969696]" />
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 flex">
            {/* Code Editor */}
            <div className="flex-1 flex">
              {/* Line Numbers & Folding */}
              <div className="bg-[#1e1e1e] border-r border-[#464647] flex">
                {/* Folding Column */}
                <div className="w-6 py-3 text-center">
                  {codeLines.map((line, index) => (
                    <div key={index} className="h-[19px] flex items-center justify-center">
                      {line.isFoldable && (
                        <button
                          onClick={() => toggleFold(line.number)}
                          className="w-3 h-3 flex items-center justify-center hover:bg-[#464647] rounded"
                        >
                          {line.isFolded ? (
                            <ChevronRight className="w-2 h-2 text-[#969696]" />
                          ) : (
                            <ChevronDown className="w-2 h-2 text-[#969696]" />
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Line Numbers */}
                <div className="px-3 py-3 text-[#858585] text-right min-w-[60px]">
                  {codeLines.map((line, index) => (
                    <div key={index} className="h-[19px] leading-[19px] text-[13px]">
                      {line.number}
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Area */}
              <div className="flex-1 bg-[#1e1e1e] py-3 px-4 overflow-auto">
                <div className="text-[#d4d4d4] leading-[19px] text-[13px]">
                  {codeLines.map((line, index) => (
                    <div key={index} className="h-[19px] whitespace-pre">
                      {!line.isFolded && (
                        <span 
                          dangerouslySetInnerHTML={{ 
                            __html: renderSyntaxHighlighting(line.content) 
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* File Explorer */}
            <div className="w-64 bg-[#252526] border-l border-[#464647]">
              <div className="p-3 border-b border-[#464647]">
                <div className="flex items-center text-[#cccccc] font-medium text-[13px]">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Scripts
                </div>
              </div>
              <div className="overflow-auto">
                {renderFileTree(files)}
              </div>
            </div>
          </div>

          {/* Bottom Toolbar */}
          <div className="bg-[#2d2d30] border-t border-[#464647] flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-1">
              <button className="flex items-center space-x-2 px-3 py-1 rounded hover:bg-[#464647] text-[#cccccc] text-[13px]">
                <Paperclip className="w-4 h-4" />
                <span>Attach</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1 rounded hover:bg-[#464647] text-[#cccccc] text-[13px]">
                <Play className="w-4 h-4" />
                <span>Execute</span>
              </button>
            </div>

            <div className="flex items-center space-x-1">
              <button className="flex items-center space-x-2 px-3 py-1 rounded hover:bg-[#464647] text-[#cccccc] text-[13px]">
                <FileOpen className="w-4 h-4" />
                <span>Open File</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1 rounded hover:bg-[#464647] text-[#cccccc] text-[13px]">
                <Save className="w-4 h-4" />
                <span>Save File</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1 rounded hover:bg-[#464647] text-[#cccccc] text-[13px]">
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;