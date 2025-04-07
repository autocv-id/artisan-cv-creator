
import React, { useState, useRef, useEffect } from 'react';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isMultiline?: boolean;
}

const EditableField = ({ 
  value, 
  onChange, 
  className = "", 
  isMultiline = false 
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const elementRef = useRef<HTMLDivElement | HTMLSpanElement>(null);
  
  useEffect(() => {
    if (isEditing && elementRef.current) {
      elementRef.current.focus();
      // Place cursor at the end
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(elementRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);
  
  const handleBlur = () => {
    if (elementRef.current) {
      onChange(elementRef.current.innerText);
      setIsEditing(false);
    }
  };
  
  const handleClick = () => {
    setIsEditing(true);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isMultiline) {
      e.preventDefault();
      elementRef.current?.blur();
    }
    
    if (e.key === 'Escape') {
      if (elementRef.current) {
        elementRef.current.innerText = value;
        elementRef.current.blur();
      }
    }
  };
  
  const editableStyle = `
    ${isEditing ? 'bg-blue-50 ring-2 ring-blue-300' : 'hover:bg-gray-50 hover:ring-1 hover:ring-gray-200'}
    outline-none rounded px-2 py-0.5 transition-all duration-150 ease-in-out
    ${className}
  `;
  
  return isMultiline ? (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={editableStyle}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  ) : (
    <span
      ref={elementRef as React.RefObject<HTMLSpanElement>}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={editableStyle}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

export default EditableField;
