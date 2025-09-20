import React, { useState } from "react";

// Utility to generate a background color based on name
const getBackgroundColor = (name = '') => {
  const colors = ['#FF5733', '#33B5FF', '#28A745', '#FFC107', '#6F42C1', '#E83E8C'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const UserAvatar = ({ user }) => {
  const [imageError, setImageError] = useState(false);

  const name = user?.name || 'Unknown User';
  const photo = user?.photo;

  const shouldShowImage =
    photo &&
    photo.trim() !== '' &&
    photo !== 'null' &&
    photo !== 'undefined' &&
    !imageError;

  return (
    <div className="avatar avatar-sm">
      {shouldShowImage ? (
        <img
          alt="avatar"
          className="rounded-circle"
          src={photo}
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className="rounded-circle d-flex align-items-center justify-content-center text-white"
          style={{
            width: '38px',
            height: '35px',
            backgroundColor: getBackgroundColor(name),
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            padding:'12px 12px'
          }}
        >
          {name.charAt(0)}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
