import React from 'react';
import {View} from 'react-native';
import DirectoryItemLoader from './DirectoryItemLoader';

export default function RecentItemsLoader() {
  return (
    <View style={{flexDirection: 'column'}}>
      <DirectoryItemLoader />
      <DirectoryItemLoader />
      <DirectoryItemLoader />
    </View>
  );
}
