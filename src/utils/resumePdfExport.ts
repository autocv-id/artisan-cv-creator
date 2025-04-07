
import { ResumeDataType } from '@/types/resume';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// We need to import React and ReactDOM for the render function
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import templates
import PrimeSuiteTemplate from '@/components/resume/profesional/templates/primesuite';
import ExecutiveEdge from '@/components/resume/profesional/templates/ExecutiveEdge';
import CorporateBlue from '@/components/resume/profesional/templates/CorporateBlue';
import FormalFocus from '@/components/resume/profesional/templates/FormalFocus';

export const generateResumePDF = async (
  resumeData: ResumeDataType,
  currentTemplate: string,
  photoUrl: string | null,
  resumeTitle: string
): Promise<void> => {
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  document.body.appendChild(tempDiv);
  
  const cleanTemplate = document.createElement('div');
  cleanTemplate.className = 'pdf-ready bg-white';
  cleanTemplate.style.width = '21cm';
  cleanTemplate.style.minHeight = '29.7cm';
  cleanTemplate.style.padding = '1.5cm';
  cleanTemplate.style.boxSizing = 'border-box';
  
  const visibleSections = resumeData.sections || {
    summary: true,
    expertise: true,
    achievements: true,
    experience: true,
    education: true,
    additional: true
  };
  
  const filteredResumeData = {
    ...resumeData,
    sections: visibleSections
  };
  
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    .pdf-ready {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      line-height: 1.5;
      letter-spacing: normal;
      font-feature-settings: normal;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      overflow: hidden;
      break-inside: avoid;
    }
    .pdf-ready * {
      letter-spacing: normal;
      word-spacing: normal;
      text-rendering: optimizeLegibility;
      page-break-inside: avoid;
    }
    .pdf-ready h1 {
      font-size: 24px;
      margin-bottom: 8px;
      font-weight: 700;
      letter-spacing: normal;
      page-break-after: avoid;
    }
    .pdf-ready h2 {
      font-size: 18px;
      margin-bottom: 8px;
      font-weight: 600;
      letter-spacing: normal;
      page-break-after: avoid;
    }
    .pdf-ready h3 {
      font-size: 16px;
      margin-bottom: 6px;
      font-weight: 600;
      letter-spacing: normal;
      page-break-after: avoid;
    }
    .pdf-ready p {
      margin-bottom: 6px;
      font-size: 14px;
      orphans: 3;
      widows: 3;
    }
    .pdf-ready ul {
      margin-top: 6px;
      margin-bottom: 12px;
    }
    .pdf-ready li {
      margin-bottom: 4px;
      font-size: 14px;
    }
    .pdf-ready .mb-6 {
      margin-bottom: 24px;
    }
    .pdf-ready .mb-4 {
      margin-bottom: 16px;
    }
    .pdf-ready .mb-2 {
      margin-bottom: 8px;
    }
    .pdf-ready .text-sm {
      font-size: 14px;
      letter-spacing: normal;
    }
    .pdf-ready section {
      page-break-inside: avoid;
    }
    .pdf-ready hr {
      page-break-after: always;
    }
    .pdf-ready .page-break {
      page-break-before: always;
    }
  `;
  document.head.appendChild(styleElement);
  
  tempDiv.appendChild(cleanTemplate);
  
  await document.fonts.ready;
  
  // Create a function to render the template
  const renderTemplate = () => {
    if (currentTemplate === 'prime-suite') {
      return <PrimeSuiteTemplate resumeData={filteredResumeData} />;
    } else if (currentTemplate === 'executive-edge') {
      return <ExecutiveEdge resumeData={filteredResumeData} photoUrl={photoUrl || undefined} />;
    } else if (currentTemplate === 'corporate-blue') {
      return <CorporateBlue resumeData={filteredResumeData} photoUrl={photoUrl || undefined} />;
    } else if (currentTemplate === 'formal-focus') {
      return <FormalFocus resumeData={filteredResumeData} photoUrl={photoUrl || undefined} />;
    } else {
      return <FormalFocus resumeData={filteredResumeData} photoUrl={photoUrl || undefined} />;
    }
  };
  
  const reactRoot = ReactDOM.createRoot(cleanTemplate);
  reactRoot.render(
    <React.StrictMode>
      {renderTemplate()}
    </React.StrictMode>
  );
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    hotfixes: ["px_scaling"]
  });
  
  const scale = 2;
  const pdfOptions = {
    scale: scale,
    useCORS: true,
    allowTaint: true,
    logging: false,
    letterRendering: true,
    backgroundColor: '#ffffff',
    imageTimeout: 15000,
    width: cleanTemplate.offsetWidth * scale,
    height: cleanTemplate.offsetHeight * scale
  };
  
  const canvas = await html2canvas(cleanTemplate, pdfOptions);
  
  const pdfWidth = 210;
  const pdfHeight = 297;
  
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  
  const finalWidth = imgWidth * ratio;
  const finalHeight = imgHeight * ratio;
  
  const imgData = canvas.toDataURL('image/jpeg', 1.0);
  
  if (imgHeight > pdfHeight) {
    const multiPageCanvas = document.createElement('canvas');
    const ctx = multiPageCanvas.getContext('2d');
    
    if (ctx) {
      const pageHeight = (pdfHeight * imgWidth) / pdfWidth;
      const totalPages = Math.ceil(imgHeight / pageHeight);
      
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }
        
        const sourceY = page * pageHeight;
        let sourceHeight = pageHeight;
        
        if (sourceY + sourceHeight > imgHeight) {
          sourceHeight = imgHeight - sourceY;
        }
        
        multiPageCanvas.width = imgWidth;
        multiPageCanvas.height = sourceHeight;
        
        ctx.drawImage(
          canvas, 
          0, sourceY, imgWidth, sourceHeight, 
          0, 0, imgWidth, sourceHeight
        );
        
        const pageData = multiPageCanvas.toDataURL('image/jpeg', 1.0);
        
        pdf.addImage(
          pageData, 
          'JPEG', 
          0, 0, 
          pdfWidth, (sourceHeight * pdfWidth) / imgWidth, 
          '', 
          'FAST'
        );
      }
    }
  } else {
    pdf.addImage(
      imgData, 
      'JPEG', 
      0, 0, 
      finalWidth, finalHeight, 
      '', 
      'FAST'
    );
  }
  
  pdf.save(`${resumeTitle.replace(/\s+/g, '_')}.pdf`);
  
  document.body.removeChild(tempDiv);
  document.head.removeChild(styleElement);
};
