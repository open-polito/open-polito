import React from 'react';
import {View} from 'react-native';
import DirectoryItem from './DirectoryItem';
import DirectoryItemLoader from './DirectoryItemLoader';
import {useSelector} from 'react-redux';
import {getRecentCourseMaterial} from '../utils/material';

export default function RecentItems({
  course = null,
  compact = false,
  relative_date = false,
}) {
  const materialTree = useSelector(state => state.material.material);
  const recentMaterial = course
    ? getRecentCourseMaterial(materialTree[course])
    : useSelector(state => state.material.recentMaterial);

  return (
    <View style={{flexDirection: 'column'}}>
      {recentMaterial != null ? (
        recentMaterial.map(item => (
          <DirectoryItem
            compact={compact}
            relative_date={relative_date}
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
