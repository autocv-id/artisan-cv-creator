
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EditorToolbarProps {
  onAddItem: (section: string) => void;
  activeSection: string;
}

const EditorToolbar = ({
  onAddItem,
  activeSection
}: EditorToolbarProps) => {
  const sectionButtonsMap: Record<string, { label: string, section: string }[]> = {
    personal: [],
    experience: [{ label: "Tambah Pengalaman", section: "experience" }],
    education: [{ label: "Tambah Pendidikan", section: "education" }],
    skills: [
      { label: "Tambah Keterampilan", section: "skills" },
      { label: "Tambah Bahasa", section: "languages" },
      { label: "Tambah Keahlian", section: "expertise" }
    ],
    awards: [
      { label: "Tambah Penghargaan", section: "awards" },
      { label: "Tambah Sertifikasi", section: "certifications" },
      { label: "Tambah Pencapaian", section: "achievements" }
    ]
  };

  const buttons = sectionButtonsMap[activeSection] || [];

  return buttons.length > 0 ? (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 mb-4 flex flex-wrap gap-2">
      {buttons.map((btn, idx) => (
        <Button 
          key={idx} 
          variant="outline" 
          size="sm" 
          onClick={() => onAddItem(btn.section)}
          className="flex items-center gap-1.5 text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
        >
          <Plus className="h-3.5 w-3.5" /> {btn.label}
        </Button>
      ))}
    </div>
  ) : null;
};

export default EditorToolbar;
