import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import DirectoryItem from './DirectoryItem';
import DirectoryItemLoader from './DirectoryItemLoader';
import {useSelector} from 'react-redux';
import {getRecentCourseMaterial} from '../utils/material';
import {RootState} from '../store/store';
import {Cartella, File} from 'open-polito-api/corso';

export default function RecentItems({
  courseID = '',
  compact = false,
  relative_date = false,
}) {
  const [recent, setRecent] = useState<(File | Cartella)[]>([]);

  const recentMaterial =
    !courseID &&
    useSelector<RootState, (File | Cartella)[]>(
      state => state.courses.recentMaterial,
    );
  const material =
    courseID &&
    useSelector<RootState, (File | Cartella)[] | undefined>(
      state =>
        state.courses.courses.find(
          course => courseID == course.code + course.name,
        )?.material,
    );

  useEffect(() => {
    if (courseID) {
      setRecent(getRecentCourseMaterial(material));
    } else {
      setRecent(recentMaterial);
    }
  }, []);

  return (
    <View
      style={{
        flexDirection: 'column',
        flex: 1,
      }}>
      {recent ? (
        recent.map(item => (
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
