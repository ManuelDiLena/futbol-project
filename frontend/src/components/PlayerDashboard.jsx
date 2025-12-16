import React from 'react';

const PlayerDashboard = ({ profile }) => {
  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold'>My Profile</h2>
      <p><span className='font-semibold text-gray-400'>Age:</span> {profile.age}</p>
      <p><span className='font-semibold text-gray-400'>City:</span> {profile.location}</p>
      <p><span className='font-semibold text-gray-400'>Availability:</span> {profile.availability}</p>
      <div>
        <h3 className='font-semibold text-gray-400'>Positions:</h3>
        <ul className='flex flex-wrap gap-2 mt-2'>
          {profile?.prositions?.map((pos) => (
            <li key={pos} className='rounded-full bg-green-800 px-3 py-1 text-sm'>
              {pos}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlayerDashboard;