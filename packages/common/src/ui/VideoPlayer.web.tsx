import {Recording} from 'open-polito-api/course';
import React from 'react';

const VideoPlayer = ({video}: {video: Recording}) => {
  return <video src={video.url} />;
};

export default VideoPlayer;
