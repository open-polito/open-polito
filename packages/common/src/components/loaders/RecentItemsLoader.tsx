import React from 'react';
import {View} from 'react-native';
import DirectoryItemLoader from './DirectoryItemLoader';
import LoaderBase from './LoaderBase';

export default function RecentItemsLoader() {
  return (
    <LoaderBase>
      <View style={{flexDirection: 'column'}}>
        <DirectoryItemLoader />
        <DirectoryItemLoader />
        <DirectoryItemLoader />
      </View>
    </LoaderBase>
  );
}
