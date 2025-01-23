import React from 'react';

const NotFound = () => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-screen bg-gray-50'>
        <p className='font-bold text-[80px]'>404</p>
        <p className='font-semibold text-[40px]'>Page Not Found</p>
        <p>The page you're looking for doesn't exist.</p>
    </div>
  );
};

export default NotFound;
