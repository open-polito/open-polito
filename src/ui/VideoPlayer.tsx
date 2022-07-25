import React, {useEffect, useState} from 'react';
import {Recording} from 'open-polito-api/course';
import RNVideo from 'react-native-video';
import Video from 'react-native-video';
import {View} from 'react-native';

const VideoPlayer = ({video}: {video: Recording}) => {
  const [ref, setRef] = useState<Video | null>(null);
  const [paused, setPaused] = useState<boolean>(false);

  return (
    <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}>
      <RNVideo
        ref={ref => setRef(ref)}
        paused={paused}
        source={{uri: video.url}}
        controls={true}
        resizeMode="contain"
        fullscreen={false}
        pictureInPicture={false}
        playInBackground={false}
        reportBandwidth={true}
        poster={video.cover_url}
        maxBitRate={0}
        onLoad={() => {}}
        onBuffer={() => {}}
        onError={() => {}}
        onBandwidthUpdate={() => {}}
        onAudioBecomingNoisy={() => setPaused(!paused)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
      />
    </View>
  );
};

export default VideoPlayer;
