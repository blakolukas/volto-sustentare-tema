import React from 'react';

const ArrowIcon = ({ isUp = false }) => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path d={isUp ? 'M4 12L9 7L14 12' : 'M4 7L9 12L14 7'} fill="#F0EAD7" />
  </svg>
);

export default ArrowIcon;
