
import React from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
    <Card className="p-4 bg-white shadow-sm border border-gray-200 rounded-lg">
      <h3 className="font-medium text-sm mb-4 text-gray-700 border-b pb-2">Kelola Bagian Resume</h3>
      <div className="space-y-3">
        {Object.entries(sections).map(([section, isVisible]) => (
          <div key={section} className="flex items-center justify-between py-1">
            <Label 
              htmlFor={`section-${section}`} 
              className="text-sm text-gray-700 cursor-pointer"
            >
              {sectionNames[section] || section}
            </Label>
            <Switch
              id={`section-${section}`}
              checked={isVisible}
              onCheckedChange={(checked) => onToggle(section, checked)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SectionManager;
