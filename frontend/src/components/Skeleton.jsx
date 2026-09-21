import React from 'react';

const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse bg-slate-200/80 rounded-lg ${className}`}
        />
      ))}
    </>
  );
};

export default Skeleton;
