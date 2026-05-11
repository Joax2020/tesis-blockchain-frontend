import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="card-skeleton" style={{
      backgroundColor: 'var(--input-bg)',
      borderRadius: '8px',
      padding: '15px',
      height: '240px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div className="skeleton-box" style={{ height: '140px', backgroundColor: 'var(--bg-panel)', borderRadius: '6px' }}></div>
      <div className="skeleton-box" style={{ height: '20px', width: '80%', backgroundColor: 'var(--bg-panel)', borderRadius: '4px' }}></div>
      <div className="skeleton-box" style={{ height: '15px', width: '40%', backgroundColor: 'var(--bg-panel)', borderRadius: '4px' }}></div>
    </div>
  );
};

export default SkeletonCard;