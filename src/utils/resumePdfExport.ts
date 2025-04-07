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
  try {
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
    
    // Create a function to render the template based on currentTemplate value
    const renderTemplate = () => {
      if (currentTemplate === 'prime-suite') {
        return React.createElement(PrimeSuiteTemplate, { resumeData: filteredResumeData });
      } else if (currentTemplate === 'executive-edge') {
        return React.createElement(ExecutiveEdge, { 
          resumeData: filteredResumeData, 
          photoUrl: photoUrl || undefined 
        });
      } else if (currentTemplate === 'corporate-blue') {
        return React.createElement(CorporateBlue, { 
          resumeData: filteredResumeData, 
          photoUrl: photoUrl || undefined 
        });
      } else if (currentTemplate === 'formal-focus') {
        return React.createElement(FormalFocus, { 
          resumeData: filteredResumeData, 
          photoUrl: photoUrl || undefined 
        });
      } else {
        return React.createElement(FormalFocus, { 
          resumeData: filteredResumeData, 
          photoUrl: photoUrl || undefined 
        });
      }
    };
    
    const reactRoot = ReactDOM.createRoot(cleanTemplate);
    reactRoot.render(
      React.createElement(React.StrictMode, null, renderTemplate())
    );
    
    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use a higher scale for better quality
    const scale = 3; // Increased from 2 to 3 for better quality
    
    // Configure html2canvas options with improved settings
    const canvasOptions = {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      letterRendering: true,
      backgroundColor: '#ffffff',
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector('.pdf-ready');
        if (clonedElement) {
          // Force a specific rendering size in the cloned document
          clonedElement.style.width = '21cm';
          clonedElement.style.height = 'auto';
          clonedElement.style.transform = 'scale(1)';
          clonedElement.style.transformOrigin = 'top left';
        }
      }
    };
    
    console.log('Generating canvas...');
    const canvas = await html2canvas(cleanTemplate, canvasOptions);
    console.log('Canvas generated with dimensions:', canvas.width, 'x', canvas.height);
    
    // First convert to PNG (temporary step)
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    // Create PDF with proper dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
      hotfixes: ["px_scaling"]
    });
    
    // A4 dimensions in mm
    const pdfWidth = 210;
    const pdfHeight = 297;
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // Calculate proper scaling
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    // Handle multi-page resume if needed
    if (imgHeight > imgWidth * (pdfHeight / pdfWidth)) {
      // This is a multi-page resume
      const pageHeight = (pdfHeight * imgWidth) / pdfWidth;
      const totalPages = Math.ceil(imgHeight / pageHeight);
      
      console.log(`Resume will be split into ${totalPages} pages`);
      
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }
        
        // Calculate which portion of the canvas to render on this page
        const sourceY = page * pageHeight;
        let sourceHeight = pageHeight;
        
        if (sourceY + sourceHeight > imgHeight) {
          sourceHeight = imgHeight - sourceY;
        }
        
        // Create a temporary canvas for this page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = sourceHeight;
        
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            canvas, 
            0, sourceY, imgWidth, sourceHeight, 
            0, 0, imgWidth, sourceHeight
          );
          
          const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
          
          // Add this page portion to the PDF
          pdf.addImage(
            pageImgData, 
            'PNG', 
            0, 0, 
            pdfWidth, (sourceHeight * pdfWidth) / imgWidth, 
            '', 
            'FAST'
          );
          
          console.log(`Added page ${page + 1} to PDF`);
        }
      }
    } else {
      // Single page resume
      pdf.addImage(
        imgData, 
        'PNG',  // Changed from JPEG to PNG for better quality
        0, 0, 
        pdfWidth, (imgHeight * pdfWidth) / imgWidth, 
        '', 
        'FAST'
      );
      console.log('Added single page to PDF');
    }
    
    // PDF filename
    const fileName = `${resumeTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Save PDF
    pdf.save(fileName);
    
    // Clean up
    document.body.removeChild(tempDiv);
    document.head.removeChild(styleElement);
    
    console.log('PDF exported successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
