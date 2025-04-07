
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import EditableField from '../EditableField';

interface Achievement {
  title: string;
  description: string;
}

interface AwardsFormProps {
  awards: string[];
  certifications: string[];
  achievements: Achievement[];
  updateAward: (index: number, value: string) => void;
  updateCertification: (index: number, value: string) => void;
  updateAchievement: (index: number, field: 'title' | 'description', value: string) => void;
  removeAward: (index: number) => void;
  removeCertification: (index: number) => void;
  removeAchievement: (index: number) => void;
}

const AwardsForm = ({
  awards,
  certifications,
  achievements,
  updateAward,
  updateCertification,
  updateAchievement,
  removeAward,
  removeCertification,
  removeAchievement
}: AwardsFormProps) => {
  return (
    <div className="space-y-4">
      {awards && awards.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Awards</h3>
          <div className="space-y-2">
            {awards.map((award, index) => (
              <div key={index} className="flex items-center gap-2">
                <EditableField
                  value={award}
                  onChange={(value) => updateAward(index, value)}
                  className="block flex-1 p-2"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAward(index)}
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {certifications && certifications.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Certifications</h3>
          <div className="space-y-2">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center gap-2">
                <EditableField
                  value={cert}
                  onChange={(value) => updateCertification(index, value)}
                  className="block flex-1 p-2"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCertification(index)}
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {achievements && achievements.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Achievements</h3>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <Card key={index} className="p-4 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAchievement(index)}
                  className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <EditableField
                    value={achievement.title}
                    onChange={(value) => updateAchievement(index, 'title', value)}
                    className="block w-full p-2"
                  />
                </div>
                <div className="space-y-2 mt-3">
                  <label className="text-sm font-medium">Description</label>
                  <EditableField
                    value={achievement.description}
                    onChange={(value) => updateAchievement(index, 'description', value)}
                    className="block w-full p-2"
                    isMultiline={true}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AwardsForm;
