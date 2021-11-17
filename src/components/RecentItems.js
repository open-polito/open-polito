import React from 'react';
import {View} from 'react-native';
import DirectoryItem from './DirectoryItem';
import DirectoryItemLoader from './DirectoryItemLoader';
import {useSelector} from 'react-redux';

export default function RecentItems() {
  const material = useSelector(state => state.material.material);

  return (
    <View style={{flexDirection: 'column'}}>
      {material != null ? (
        material.map(item => (
          <DirectoryItem
            key={item.code}
            filename={item.filename}
            data_inserimento={item.data_inserimento}
            corso={item.corso}
            size_kb={item.size_kb}
          />
        ))
      ) : (
        <View>
          <DirectoryItemLoader />
          <DirectoryItemLoader />
          <DirectoryItemLoader />
        </View>
      )}
    </View>
  );
}
