import React from 'react';
import {View} from 'react-native';
import DirectoryItem from './DirectoryItem';
import DirectoryItemLoader from './DirectoryItemLoader';
import {useSelector} from 'react-redux';

export default function RecentItems() {
  const recentMaterial = useSelector(state => state.material.recentMaterial);

  return (
    <View style={{flexDirection: 'column'}}>
      {recentMaterial != null ? (
        recentMaterial.map(item => (
          <DirectoryItem
            tipo={item.tipo}
            key={item.code}
            nome={item.nome}
            filename={item.filename}
            data_inserimento={item.data_inserimento}
            corso={item.corso}
            size_kb={item.size_kb}
            code={item.code}
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
