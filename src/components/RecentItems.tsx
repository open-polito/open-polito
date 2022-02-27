import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import DirectoryItem from './DirectoryItem';
import DirectoryItemLoader from './loaders/DirectoryItemLoader';
import {useSelector} from 'react-redux';
import {getRecentCourseMaterial} from '../utils/material';
import {RootState} from '../store/store';
import {File, MaterialItem} from 'open-polito-api/material';

export default function RecentItems({
  courseID = '',
  compact = false,
  relativeDate = false,
}) {
  const [recent, setRecent] = useState<File[]>([]);

  const recentMaterial = courseID
    ? []
    : useSelector<RootState, File[]>(state => state.courses.recentMaterial);
  const material =
    courseID &&
    useSelector<RootState, MaterialItem[] | undefined>(
      state =>
        state.courses.courses.find(
          course => courseID == course.basicInfo.code + course.basicInfo.name,
        )?.extendedInfo?.material,
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
      {recent.length > 0 ? (
        recent.map(item => (
          <DirectoryItem
            item={item}
            compact={compact}
            relativeDate={relativeDate}
            course=""
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
