import React from 'react';

const createIconComponent = (name: string) => {
  const IconComponent = () => <span>{name}</span>;
  IconComponent.displayName = name;
  return IconComponent;
};

export const PhotoCamera = createIconComponent('PhotoCamera');
export const VideoCameraBack = createIconComponent('VideoCameraBack');
export const Link = createIconComponent('Link');
export const LocationOn = createIconComponent('LocationOn');
export const Tag = createIconComponent('Tag');
export const Favorite = createIconComponent('Favorite');
export const FavoriteBorder = createIconComponent('FavoriteBorder');
export const Comment = createIconComponent('Comment');
export const Close = createIconComponent('Close');