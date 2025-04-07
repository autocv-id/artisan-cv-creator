
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import EditableField from '../EditableField';

interface ExperienceItem {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ExperienceFormProps {
  experiences: ExperienceItem[];
  updateExperience: (id: number, field: string, value: string) => void;
  removeItem: (index: number) => void;
}

const ExperienceForm = ({
  experiences,
  updateExperience,
  removeItem
}: ExperienceFormProps) => {
  return (
    <div className="space-y-6">
      {experiences.map((exp, index) => (
        <Card key={exp.id} className="p-4 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(index)}
            className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="space-y-2">
            <label className="text-sm font-medium">Position</label>
            <EditableField
              value={exp.position}
              onChange={(value) => updateExperience(exp.id, 'position', value)}
              className="block w-full p-2"
            />
          </div>
          <div className="space-y-2 mt-3">
            <label className="text-sm font-medium">Company</label>
            <EditableField
              value={exp.company}
              onChange={(value) => updateExperience(exp.id, 'company', value)}
              className="block w-full p-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <EditableField
                value={exp.startDate}
                onChange={(value) => updateExperience(exp.id, 'startDate', value)}
                className="block w-full p-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <EditableField
                value={exp.endDate}
                onChange={(value) => updateExperience(exp.id, 'endDate', value)}
                className="block w-full p-2"
              />
            </div>
          </div>
          <div className="space-y-2 mt-3">
            <label className="text-sm font-medium">Description</label>
            <EditableField
              value={exp.description}
              onChange={(value) => updateExperience(exp.id, 'description', value)}
              className="block w-full p-2 min-h-[100px]"
              isMultiline={true}
            />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ExperienceForm;
