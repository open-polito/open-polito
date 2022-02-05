import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, ScrollView, View} from 'react-native';
import styles from '../styles';
import colors from '../colors';
import Header from '../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import TextInput from '../components/TextInput';
import {TextN, TextSubTitle} from '../components/Text';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';
import {useContext} from 'react';
import RecentItems from '../components/RecentItems';
import RecentItemsLoader from '../components/RecentItemsLoader';
import {Rect} from 'react-native-svg';
import MaterialExplorer from '../components/MaterialExplorer';
import ScreenContainer from '../components/ScreenContainer';
import DropdownSelector from '../components/DropdownSelector';
import {DeviceContext} from '../context/Device';
import {RootState} from '../store/store';
import {
  CourseState,
  getRecentMaterial,
  loadCourse,
} from '../store/coursesSlice';
import {Status, STATUS} from '../store/status';
import {useNavigation} from '@react-navigation/core';
import {DropdownItem} from '../types';

export default function Material() {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const courses = useSelector<RootState, CourseState[]>(
    state => state.courses.courses,
  );

  const getRecentMaterialStatus = useSelector<RootState, Status>(
    state => state.courses.getRecentMaterialStatus,
  );

  const deviceContext = useContext(DeviceContext);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [materialLoaded, setMaterialLoaded] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>([]);

  /**
   * Initialize dropdown list
   */
  const initDropdown = () => {
    const items: DropdownItem[] = courses.map(course => {
      return {
        label: course.name,
        value: course.code + course.name,
      };
    });
    setDropdownItems(items);
  };

  /**
   * Initial setup.
   * Load all course data if not already loaded, set {@link materialLoaded} to true if already loaded.
   */
  useEffect(() => {
    let _materialLoaded = true;
    courses.forEach(course => {
      if (course.loadCourseStatus.code != STATUS.SUCCESS) {
        _materialLoaded = false;
        dispatch(
          loadCourse({courseData: course, device: deviceContext.device}),
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
        if (course.loadCourseStatus.code != STATUS.SUCCESS) {
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
   * Finally, when recent material has been loaded, initialize dropdown menu
   * and set {@link allLoaded} to true.
   */
  useEffect(() => {
    if (getRecentMaterialStatus.code == STATUS.SUCCESS) {
      initDropdown();
      setAllLoaded(true);
    }
  }, [getRecentMaterialStatus]);

  return (
    <ScreenContainer style={{paddingHorizontal: 0}}>
      <View style={styles.withHorizontalPadding}>
        <Header text={t('material')} noMarginBottom={true} />
        <View style={{marginBottom: 16, ...styles.paddingFromHeader}}>
          {/* search container */}
          {allLoaded && (
            <Pressable
              onPress={() => {
                navigation.navigate('MaterialSearch');
              }}>
              <TextInput
                icon="search"
                placeholder={t('searchMaterial')}
                borderColor="none"
                borderWidth={0}
                iconColor={colors.gray}
                editable={false}
              />
            </Pressable>
          )}
        </View>
      </View>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            ...styles.withHorizontalPadding,
          }}>
          <Icon name="history" size={24} color={colors.black} />
          <TextSubTitle
            text={t('recentMaterial')}
            color={colors.black}
            style={{marginLeft: 4}}
          />
        </View>
        <View style={styles.withHorizontalPadding}>
          {allLoaded ? <RecentItems relative_date /> : <RecentItemsLoader />}
        </View>
        <View
          style={{
            ...styles.withHorizontalPadding,
            marginTop: 16,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TextSubTitle style={{flex: 1}} text={t('byCourse')} />
          {allLoaded ? (
            <View
              style={{
                flex: 2,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <DropdownSelector
                items={dropdownItems}
                placeholder={{label: t('selectCourseDropdown'), value: null}}
                onValueChange={value => {
                  setSelectedCourse(value ? value : null);
                }}
              />
            </View>
          ) : (
            <SvgAnimatedLinearGradient height={32} width={400}>
              <Rect x="0" y="0" rx="4" ry="4" width="75" height="24" />
              <Rect x="85" y="0" rx="4" ry="4" width="150" height="24" />
              <Rect x="250" y="0" rx="4" ry="4" width="100" height="24" />
            </SvgAnimatedLinearGradient>
          )}
        </View>
        {selectedCourse == null ? (
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              ...styles.withHorizontalPadding,
            }}>
            <TextN style={{marginTop: 16}} text={t('selectCourse')} />
          </View>
        ) : (
          <View style={styles.withHorizontalPadding}>
            <MaterialExplorer course={selectedCourse} />
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
