'use client';

import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import { 
  FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, 
  FaAlignRight, FaList, FaListOl, FaPalette 
} from "react-icons/fa";
import 'draft-js/dist/Draft.css';

interface RichTextEditorProps {
    editorState: EditorState;
    setEditorState: (state: EditorState) => void;
    onContentChange?: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  editorState, 
  setEditorState,
  onContentChange 
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
        setEditorState(newState);
        return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const colors = ['red', 'blue', 'green', 'purple', 'orange'];

  // Send content to parent whenever it changes
  useEffect(() => {
    if (onContentChange) {
      const contentState = editorState.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      const contentString = JSON.stringify(rawContent);
      onContentChange(contentString);
    }
  }, [editorState, onContentChange]);

  return (
    <>
      <div className="flex flex-wrap gap-3 mt-4 p-2 bg-gray-50 rounded-lg">
        {/* Text Style Group */}
        <div className="flex gap-2 border-r pr-3">
          <button
            className={`p-2.5 rounded-lg transition-all duration-200 hover:shadow-sm
              ${editorState.getCurrentInlineStyle().has('BOLD')
                ? 'bg-indigo-100 text-indigo-600 shadow-sm hover:bg-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
              }`}
            onClick={() => toggleInlineStyle('BOLD')}
          >
            <FaBold size={16} />
          </button>
          <button
            className={`p-2.5 rounded-lg transition-all duration-200 hover:shadow-sm
              ${editorState.getCurrentInlineStyle().has('ITALIC')
                ? 'bg-indigo-100 text-indigo-600 shadow-sm hover:bg-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
              }`}
            onClick={() => toggleInlineStyle('ITALIC')}
          >
            <FaItalic size={16} />
          </button>
          <button
            className={`p-2.5 rounded-lg transition-all duration-200 hover:shadow-sm
              ${editorState.getCurrentInlineStyle().has('UNDERLINE')
                ? 'bg-indigo-100 text-indigo-600 shadow-sm hover:bg-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
              }`}
            onClick={() => toggleInlineStyle('UNDERLINE')}
          >
            <FaUnderline size={16} />
          </button>
        </div>

        {/* Alignment Group */}
        <div className="flex gap-2 border-r pr-3">
          <button
            className={`p-2.5 rounded-lg transition-all duration-200 hover:shadow-sm
              ${editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType() === 'left-align'
                ? 'bg-indigo-100 text-indigo-600 shadow-sm hover:bg-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
              }`}
            onClick={() => toggleBlockType('left-align')}
          >
            <FaAlignLeft size={16} />
          </button>
          <button
            className={`p-2.5 rounded-lg transition-all duration-200 hover:shadow-sm
              ${editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType() === 'center-align'
                ? 'bg-indigo-100 text-indigo-600 shadow-sm hover:bg-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
              }`}
            onClick={() => toggleBlockType('center-align')}
          >
            <FaAlignCenter size={16} />
          </button>
          <button
            className={`p-2.5 rounded-lg transition-all duration-200 hover:shadow-sm
              ${editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType() === 'right-align'
                ? 'bg-indigo-100 text-indigo-600 shadow-sm hover:bg-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
              }`}
            onClick={() => toggleBlockType('right-align')}
          >
            <FaAlignRight size={16} />
          </button>
        </div>

        {/* List Group */}
        <div className="flex gap-2 border-r pr-3">
          <button
            className={`p-2.5 rounded-lg transition-all duration-200 hover:shadow-sm
              ${editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType() === 'unordered-list-item'
                ? 'bg-indigo-100 text-indigo-600 shadow-sm hover:bg-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
              }`}
            onClick={() => toggleBlockType('unordered-list-item')}
          >
            <FaList size={16} />
          </button>
          <button
            className={`p-2.5 rounded-lg transition-all duration-200 hover:shadow-sm
              ${editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType() === 'ordered-list-item'
                ? 'bg-indigo-100 text-indigo-600 shadow-sm hover:bg-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
              }`}
            onClick={() => toggleBlockType('ordered-list-item')}
          >
            <FaListOl size={16} />
          </button>
        </div>

        {/* Color Picker */}
        <div className="relative">
          <button
            className="p-2.5 rounded-lg transition-all duration-200 hover:shadow-sm text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <FaPalette size={16} />
          </button>
          {showColorPicker && (
            <div className="absolute top-full mt-2 p-2 bg-white rounded-lg shadow-lg flex gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full transition-transform hover:scale-110`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    toggleInlineStyle(`COLOR-${color.toUpperCase()}`);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border rounded-lg p-4 min-h-[200px] editor-wrapper mt-2">
        <style jsx global>{`
          .editor-wrapper .DraftEditor-root {
            color: #1b1b1b;
          }
          .editor-wrapper .public-DraftEditorPlaceholder-root {
            color: #6b7280;
          }
          .editor-wrapper .DraftEditor-editorContainer {
            font-size: 16px;
            line-height: 1.5;
          }
          .editor-wrapper .text-color-red { color: red; }
          .editor-wrapper .text-color-blue { color: blue; }
          .editor-wrapper .text-color-green { color: green; }
          .editor-wrapper .text-color-purple { color: purple; }
          .editor-wrapper .text-color-orange { color: orange; }
          .editor-wrapper .left-align { text-align: left; }
          .editor-wrapper .center-align { text-align: center; }
          .editor-wrapper .right-align { text-align: right; }
        `}</style>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          placeholder="Start typing here..."
        />
      </div>
    </>
  );
};

export default RichTextEditor;
