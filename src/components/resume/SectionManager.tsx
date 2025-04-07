
import React from 'react';
import { Card } from '@/components/ui/card';

interface SectionManagerProps {
  sections: Record<string, boolean>;
  onToggle: (section: string, visible: boolean) => void;
}

const SectionManager = ({
  sections,
  onToggle
}: SectionManagerProps) => {
  const sectionNames: Record<string, string> = {
    summary: "Ringkasan",
    expertise: "Area Keahlian",
    achievements: "Pencapaian Utama",
    experience: "Pengalaman Profesional",
    education: "Pendidikan",
    additional: "Informasi Tambahan"
  };

  return (
    <Card className="p-4 mb-4 bg-white shadow-sm">
      <h3 className="font-medium text-sm mb-3 text-gray-700">Kelola Bagian Resume</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(sections).map(([section, isVisible]) => (
          <div key={section} className="flex items-center space-x-2 bg-gray-50 p-2 rounded hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              id={`section-${section}`}
              checked={isVisible}
              onChange={() => onToggle(section, !isVisible)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor={`section-${section}`} className="text-sm text-gray-700 cursor-pointer">
              {sectionNames[section] || section}
            </label>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SectionManager;
