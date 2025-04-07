
import React from 'react';
import EditableField from '../EditableField';

interface PersonalInfoFormProps {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  updateField: (field: string, value: string) => void;
}

const PersonalInfoForm = ({
  fullName,
  title,
  email,
  phone,
  location,
  website,
  summary,
  updateField
}: PersonalInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <EditableField
          value={fullName}
          onChange={(value) => updateField('fullName', value)}
          className="block w-full p-2"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Job Title</label>
        <EditableField
          value={title}
          onChange={(value) => updateField('title', value)}
          className="block w-full p-2"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <EditableField
          value={email}
          onChange={(value) => updateField('email', value)}
          className="block w-full p-2"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone</label>
        <EditableField
          value={phone}
          onChange={(value) => updateField('phone', value)}
          className="block w-full p-2"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Location</label>
        <EditableField
          value={location}
          onChange={(value) => updateField('location', value)}
          className="block w-full p-2"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Website</label>
        <EditableField
          value={website}
          onChange={(value) => updateField('website', value)}
          className="block w-full p-2"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Summary</label>
        <EditableField
          value={summary}
          onChange={(value) => updateField('summary', value)}
          className="block w-full p-2 min-h-[100px]"
          isMultiline={true}
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
