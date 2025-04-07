
import React from 'react';
import { ResumeDataType } from '@/types/resume';
import PrimeSuiteTemplate from '@/components/resume/profesional/templates/primesuite';
import ExecutiveEdge from '@/components/resume/profesional/templates/ExecutiveEdge';
import CorporateBlue from '@/components/resume/profesional/templates/CorporateBlue';
import FormalFocus from '@/components/resume/profesional/templates/FormalFocus';

interface ResumePreviewProps {
  resumeData: ResumeDataType;
  currentTemplate: string;
  photoUrl: string | null;
  editorZoom?: number;
}

const ResumePreview = ({
  resumeData,
  currentTemplate,
  photoUrl,
  editorZoom = 100
}: ResumePreviewProps) => {
  return (
    <div 
      className="bg-white shadow-lg overflow-hidden max-w-full mx-auto"
      style={{ 
        width: `${21 * (editorZoom / 100)}cm`,
        minHeight: `${29.7 * (editorZoom / 100)}cm`,
        transform: `scale(${editorZoom / 100})`,
        transformOrigin: 'top center',
      }}
    >
      {currentTemplate === 'prime-suite' ? (
        <PrimeSuiteTemplate resumeData={resumeData} />
      ) : currentTemplate === 'executive-edge' ? (
        <ExecutiveEdge resumeData={resumeData} photoUrl={photoUrl || undefined} />
      ) : currentTemplate === 'corporate-blue' ? (
        <CorporateBlue resumeData={resumeData} photoUrl={photoUrl || undefined} />
      ) : currentTemplate === 'formal-focus' ? (
        <FormalFocus resumeData={resumeData} photoUrl={photoUrl || undefined} />
      ) : (
        <FormalFocus resumeData={resumeData} photoUrl={photoUrl || undefined} />
      )}
    </div>
  );
};

export default ResumePreview;
