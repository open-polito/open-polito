import {Recording} from 'open-polito-api/lib/course';
import React from 'react';

const VideoPlayer = ({video}: {video: Recording}) => {
  return <video src={video.url} controls autoPlay />;
};

export default VideoPlayer;
