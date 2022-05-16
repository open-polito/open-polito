import {Directory, MaterialItem} from 'open-polito-api/material';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';
import DirectoryItemRecursive from './DirectoryItemRecursive';
import NoContent from '../components/NoContent';
import {CoursesState, CourseState} from '../store/coursesSlice';
import DirectoryItem from './DirectoryItem';

type MaterialDict = {[code: string]: MaterialItem};

export default function MaterialExplorer({
  courseId,
  dark,
}: {
  courseId: string; // Set to "all" to show all courses
  dark: boolean;
}) {
  const {courses} = useSelector<RootState, CoursesState>(
    state => state.courses,
  );

  return (
    <View>
      {courseId == 'all'
        ? courses.map(course => (
            <DirectoryItemRecursive
              item={{
                type: 'dir',
                code: course.basicInfo.code + course.basicInfo.name,
                name: course.basicInfo.name,
                children: course.extendedInfo?.material || [],
              }}
              key={course.basicInfo.code + course.basicInfo.name}
              dark={dark}
            />
          ))
        : (
            courses.find(
              course =>
                course.basicInfo.code + course.basicInfo.name == courseId,
            )?.extendedInfo?.material || []
          ).map(item => (
            <DirectoryItemRecursive item={item} key={item.code} dark={dark} />
          ))}
    </View>
  );
}
