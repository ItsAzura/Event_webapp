import React, { useState, useEffect } from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback }) => {
  const [avatarUrl, setAvatarUrl] = useState(src);

  useEffect(() => {
    if (!src) {
      const randomAvatar = `https://avatar.iran.liara.run/username?username=${fallback}`;
      setAvatarUrl(randomAvatar);
    }
  }, [src, fallback]);

  return (
    <div className="relative h-10 w-10">
      <img
        src={avatarUrl}
        alt={alt}
        className="h-full w-full rounded-full object-cover"
      />
    </div>
  );
};

export default Avatar;
