import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import styles from '../styles';
import colors from '../colors';
import {useDispatch, useSelector} from 'react-redux';
import {TextN, TextSubTitle} from '../components/Text';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useContext} from 'react';
import RecentItems from '../components/RecentItems';
import RecentItemsLoader from '../components/loaders/RecentItemsLoader';
import {Rect} from 'react-native-svg';
import MaterialExplorer from '../ui/MaterialExplorer';
import ScreenContainer from '../components/ScreenContainer';
import DropdownSelector from '../components/DropdownSelector';
import {DeviceContext} from '../context/Device';
import {AppDispatch, RootState} from '../store/store';
import {
  CoursesState,
  CourseState,
  getRecentMaterial,
  loadCourse,
} from '../store/coursesSlice';
import {Status, STATUS} from '../store/status';
import {useNavigation} from '@react-navigation/core';
import {DropdownItem} from '../types';
import Screen from '../ui/Screen';
import {p} from '../scaling';
import TextInput from '../ui/core/TextInput';
import Header, {HEADER_TYPE} from '../ui/Header';
import Tabs from '../ui/Tabs';
import DirectoryItem from '../ui/DirectoryItem';
import PressableBase from '../ui/core/PressableBase';

// TODO folder stats (n of files, folder size)
// TODO download features (e.g. download folders too, selection feature, ...)

const tabs = ['explore', 'recentlyAdded'];

export default function Material() {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const courses = useSelector<RootState, CourseState[]>(
    state => state.courses.courses,
  );

  const {getRecentMaterialStatus, recentMaterial} = useSelector<
    RootState,
    CoursesState
  >(state => state.courses);

  const [selectedTab, setSelectedTab] = useState(0);

  const {dark, device} = useContext(DeviceContext);

  const [materialLoaded, setMaterialLoaded] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  /**
   * Initial setup.
   * Load all course data if not already loaded, set {@link materialLoaded} to true if already loaded.
   */
  useEffect(() => {
    let _materialLoaded = true;
    courses.forEach(course => {
      if (course.status.code != STATUS.SUCCESS) {
        _materialLoaded = false;
        dispatch(
          loadCourse({
            basicCourseInfo: course.basicInfo,
            device: device,
          }),
        );
      }
    });
    _materialLoaded && setMaterialLoaded(true);
  }, []);

  /**
   * Called each time {@link courses} changes.
   * Check if data is loaded, then set {@link materialLoaded} to true if so.
   */
  useEffect(() => {
    if (!materialLoaded) {
      let _materialLoaded = true;
      courses.forEach(course => {
        if (course.status.code != STATUS.SUCCESS) {
          _materialLoaded = false;
        }
      });
      _materialLoaded && setMaterialLoaded(true);
    }
  }, [courses]);

  /**
   * When {@link materialLoaded}, get recent material only if not already set.
   */
  useEffect(() => {
    if (
      materialLoaded &&
      getRecentMaterialStatus.code != STATUS.SUCCESS &&
      getRecentMaterialStatus.code != STATUS.PENDING
    ) {
      dispatch(getRecentMaterial());
    }
  }, [materialLoaded]);

  /**
   * Finally, when recent material has been loaded, set {@link allLoaded} to true.
   */
  useEffect(() => {
    if (getRecentMaterialStatus.code == STATUS.SUCCESS) {
      setAllLoaded(true);
    }
  }, [getRecentMaterialStatus]);

  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        marginTop: 24 * p,
        paddingHorizontal: 16 * p,
        paddingBottom: 16 * p,
      },
    });
  }, [dark]);

  return (
    <Screen>
      <Header headerType={HEADER_TYPE.MAIN} title={t('material')} />
      <FlatList
        data={[0]}
        renderItem={() => (
          <View style={_styles.container}>
            <PressableBase
              onPress={() => {
                navigation.navigate('Search');
              }}>
              <TextInput
                editable={false}
                placeholder={t('searchForAnything')}
                dark={dark}
                icon="search"
              />
            </PressableBase>
            <Tabs
              style={{marginTop: 24 * p, marginBottom: 16 * p}}
              onChange={i => setSelectedTab(i)}
              dark={dark}
              items={tabs.map(tab => {
                return {label: t(tab), value: tab};
              })}
            />
            {selectedTab == 0 ? (
              <MaterialExplorer courseId="all" dark={dark} />
            ) : (
              <FlatList
                data={recentMaterial}
                keyExtractor={item => item.code}
                renderItem={({item}) => (
                  <DirectoryItem
                    item={item}
                    key={item.code}
                    dark={dark}
                    course={item.course_name}
                  />
                )}
              />
            )}
          </View>
        )}
      />
    </Screen>
  );
}
