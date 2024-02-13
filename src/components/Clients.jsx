import React from 'react';
import Avatar from 'react-avatar';

const Client = ({ username }) => {
  return (
    <div className='flex flex-col mr-4'>
      <Avatar name={username} size={50} round="14px" />
      <span className=''>{username}</span>
    </div>
  );
};

export default Client;
