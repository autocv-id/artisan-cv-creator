
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import EditableField from '../EditableField';

interface EducationItem {
  id: number;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EducationFormProps {
  educations: EducationItem[];
  updateEducation: (id: number, field: string, value: string) => void;
  removeItem: (index: number) => void;
}

const EducationForm = ({
  educations,
  updateEducation,
  removeItem
}: EducationFormProps) => {
  return (
    <div className="space-y-6">
      {educations.map((edu, index) => (
        <Card key={edu.id} className="p-4 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(index)}
            className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="space-y-2">
            <label className="text-sm font-medium">School</label>
            <EditableField
              value={edu.school}
              onChange={(value) => updateEducation(edu.id, 'school', value)}
              className="block w-full p-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Degree</label>
              <EditableField
                value={edu.degree}
                onChange={(value) => updateEducation(edu.id, 'degree', value)}
                className="block w-full p-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Field of Study</label>
              <EditableField
                value={edu.field}
                onChange={(value) => updateEducation(edu.id, 'field', value)}
                className="block w-full p-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <EditableField
                value={edu.startDate}
                onChange={(value) => updateEducation(edu.id, 'startDate', value)}
                className="block w-full p-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <EditableField
                value={edu.endDate}
                onChange={(value) => updateEducation(edu.id, 'endDate', value)}
                className="block w-full p-2"
              />
            </div>
          </div>
          <div className="space-y-2 mt-3">
            <label className="text-sm font-medium">Description</label>
            <EditableField
              value={edu.description}
              onChange={(value) => updateEducation(edu.id, 'description', value)}
              className="block w-full p-2 min-h-[100px]"
              isMultiline={true}
            />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default EducationForm;
