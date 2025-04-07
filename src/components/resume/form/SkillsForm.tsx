
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import EditableField from '../EditableField';

interface SkillsFormProps {
  skills: string[];
  languages: string[];
  expertise: string[];
  updateSkill: (index: number, value: string) => void;
  updateLanguage: (index: number, value: string) => void;
  updateExpertise: (index: number, value: string) => void;
  removeSkill: (index: number) => void;
  removeLanguage: (index: number) => void;
  removeExpertise: (index: number) => void;
}

const SkillsForm = ({
  skills,
  languages,
  expertise,
  updateSkill,
  updateLanguage,
  updateExpertise,
  removeSkill,
  removeLanguage,
  removeExpertise
}: SkillsFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Skills</h3>
        <div className="space-y-2">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-2">
              <EditableField
                value={skill}
                onChange={(value) => updateSkill(index, value)}
                className="block flex-1 p-2"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSkill(index)}
                className="h-8 w-8 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-2">Languages</h3>
        <div className="space-y-2">
          {languages.map((language, index) => (
            <div key={index} className="flex items-center gap-2">
              <EditableField
                value={language}
                onChange={(value) => updateLanguage(index, value)}
                className="block flex-1 p-2"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeLanguage(index)}
                className="h-8 w-8 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {expertise && expertise.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Areas of Expertise</h3>
          <div className="space-y-2">
            {expertise.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <EditableField
                  value={item}
                  onChange={(value) => updateExpertise(index, value)}
                  className="block flex-1 p-2"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExpertise(index)}
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsForm;
