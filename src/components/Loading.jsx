import React from 'react';
import './Loading.css';

const Loading = ({ small = false }) => {
  return (
    <div className={`loading-container ${small ? 'small' : ''}`}>
      <div className="loading-spinner"></div>
      {!small && <p>Loading...</p>}
    </div>
  );
};

export default Loading;