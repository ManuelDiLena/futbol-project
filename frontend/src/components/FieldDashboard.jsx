import React from 'react';

const FieldDashboard = ({ profile }) => {
  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold'>{profile.fieldName}</h2>
      <p><span className='font-semibold text-gray-400'>City:</span> {profile.location}</p>
      <p><span className='font-semibold text-gray-400'>Schedules:</span> {profile.schedules}</p>
      <p><span className='font-semibold text-gray-400'>N° Fields:</span> {profile.fieldCount}</p>
      <div>
        <h3 className='font-semibold text-gray-400'>Types of matches:</h3>
        <ul className='flex flex-wrap gap-2 mt-2'>
          {profile.matchTypes.map((type) => (
            <li key={type} className='rounded-full bg-green-800 px-3 py-1 text-sm'>
              {type}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FieldDashboard;