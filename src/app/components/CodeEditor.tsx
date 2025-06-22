"use client";
import { useState, useRef, KeyboardEvent } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  language?: string;
  height?: string;
}

export default function CodeEditor({
  value,
  onChange,
  placeholder = "Enter your code...",
  language = "typescript",
  height = "h-40",
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineCount, setLineCount] = useState(1);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd } = textarea;

    // Handle Tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault();

      if (e.shiftKey) {
        // Shift+Tab: Remove indentation
        const lines = value.split("\n");
        const start = value.lastIndexOf("\n", selectionStart - 1) + 1;
        const end = value.indexOf("\n", selectionEnd);
        const selectedText = value.substring(
          start,
          end === -1 ? value.length : end
        );

        if (selectedText.startsWith("  ")) {
          const newValue =
            value.substring(0, start) +
            selectedText.substring(2) +
            value.substring(end === -1 ? value.length : end);
          onChange(newValue);

          // Restore cursor position
          setTimeout(() => {
            if (textarea) {
              textarea.selectionStart = selectionStart - 2;
              textarea.selectionEnd = selectionEnd - 2;
            }
          }, 0);
        }
      } else {
        // Tab: Add indentation
        const newValue =
          value.substring(0, selectionStart) +
          "  " +
          value.substring(selectionEnd);
        onChange(newValue);

        // Move cursor after the inserted spaces
        setTimeout(() => {
          if (textarea) {
            textarea.selectionStart = textarea.selectionEnd =
              selectionStart + 2;
          }
        }, 0);
      }
    }

    // Handle Enter key for auto-indentation
    if (e.key === "Enter") {
      e.preventDefault();

      // Find current line indentation
      const lines = value.substring(0, selectionStart).split("\n");
      const currentLine = lines[lines.length - 1];
      const indentation = currentLine.match(/^(\s*)/)?.[1] || "";

      // Check if current line ends with { or : for extra indentation
      const needsExtraIndent =
        currentLine.trim().endsWith("{") ||
        currentLine.trim().endsWith(":") ||
        currentLine.trim().endsWith("(");

      const newIndentation = needsExtraIndent
        ? indentation + "  "
        : indentation;
      const newValue =
        value.substring(0, selectionStart) +
        "\n" +
        newIndentation +
        value.substring(selectionEnd);

      onChange(newValue);

      // Move cursor to end of new indentation
      setTimeout(() => {
        if (textarea) {
          const newPosition = selectionStart + 1 + newIndentation.length;
          textarea.selectionStart = textarea.selectionEnd = newPosition;
        }
      }, 0);
    }

    // Handle closing brackets
    if (e.key === "}" && !e.shiftKey) {
      const lines = value.substring(0, selectionStart).split("\n");
      const currentLine = lines[lines.length - 1];

      if (currentLine.trim() === "" && currentLine.length >= 2) {
        e.preventDefault();
        // Remove 2 spaces and add }
        const newValue =
          value.substring(0, selectionStart - 2) +
          "}" +
          value.substring(selectionEnd);
        onChange(newValue);

        setTimeout(() => {
          if (textarea) {
            textarea.selectionStart = textarea.selectionEnd =
              selectionStart - 1;
          }
        }, 0);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Update line count
    const lines = newValue.split("\n").length;
    setLineCount(lines);
  };

  const addSyntaxHighlighting = (code: string) => {
    // Basic syntax highlighting for display
    return code
      .replace(
        /(function|const|let|var|if|else|for|while|return|class|interface|type|export|import|from|async|await)/g,
        '<span class="text-blue-400">$1</span>'
      )
      .replace(
        /(string|number|boolean|void|null|undefined)/g,
        '<span class="text-green-400">$1</span>'
      )
      .replace(
        /(".*?"|'.*?'|`.*?`)/g,
        '<span class="text-yellow-300">$1</span>'
      )
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>')
      .replace(/(\d+)/g, '<span class="text-purple-400">$1</span>');
  };

  return (
    <div className="relative bg-gray-900 rounded-xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-400 text-sm font-mono ml-4">
            {language}
          </span>
        </div>
        <div className="text-gray-400 text-sm">Lines: {lineCount}</div>
      </div>

      {/* Editor */}
      <div className="relative">
        {/* Line Numbers */}
        <div className="absolute left-0 top-0 z-10 bg-gray-800 border-r border-white/10 p-4 text-gray-500 font-mono text-sm leading-6 select-none">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="text-right pr-2">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full ${height} bg-transparent text-white font-mono text-sm leading-6 p-4 pl-16 resize-none focus:outline-none placeholder-gray-500`}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />

        {/* Syntax Highlighting Overlay (Optional - for display only) */}
        {value && (
          <div
            className="absolute top-0 left-16 p-4 pointer-events-none text-transparent font-mono text-sm leading-6 whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: addSyntaxHighlighting(value) }}
          />
        )}
      </div>

      {/* Footer with shortcuts */}
      <div className="px-4 py-2 bg-gray-800 border-t border-white/10 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Tab: Indent • Shift+Tab: Unindent • Enter: Auto-indent</span>
          <span>Ctrl+/ : Comment</span>
        </div>
      </div>
    </div>
  );
}
