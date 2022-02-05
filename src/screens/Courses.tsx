import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, ScrollView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../colors';
import ArrowHeader from '../components/ArrowHeader';
import ScreenContainer from '../components/ScreenContainer';
import {TextN, TextS} from '../components/Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles';
import {DeviceContext} from '../context/Device';
import {CourseData} from '../store/coursesSlice';
import {RootState} from '../store/store';

export default function Courses({navigation}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const deviceContext = useContext(DeviceContext);

  const courses = useSelector<RootState, CourseData[]>(
    state => state.courses.courses,
  );

  const [offsetY, setOffsetY] = useState(0);

  const buildCourseButton = (course: CourseData) => {
    return (
      <View key={course.code + course.name}>
        <Pressable
          onPress={() => {
            navigation.navigate('Course', {
              courseCode: course.code + course.name,
            });
          }}
          android_ripple={{color: colors.lightGray}}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            marginBottom: 16,
            backgroundColor: colors.white,
            borderRadius: 4,
            ...styles.elevatedSmooth,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'column', width: '90%'}}>
              <TextN text={course.name} numberOfLines={1} weight="regular" />
              <TextS text={course.cfu + ' CFU'} />
            </View>
            <Icon
              name="chevron-right"
              color={colors.mediumGray}
              size={24}
              style={{position: 'absolute', right: 0}}
            />
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <ScreenContainer style={{paddingHorizontal: 0}}>
      <View style={styles.withHorizontalPadding}>
        <ArrowHeader text={t('courses')} backFunc={navigation.goBack} />
      </View>
      <View style={{flex: 1}}>
        <ScrollView
          onScroll={e => {
            setOffsetY(e.nativeEvent.contentOffset.y);
          }}
          contentContainerStyle={{
            ...styles.withHorizontalPadding,
            paddingBottom: offsetY < 16 ? 32 : 16,
            ...styles.paddingFromHeader,
          }}>
          {courses != null &&
            courses
              .filter(course => course.isMain)
              .map(mainCourse => buildCourseButton(mainCourse))}
          {courses.filter(course => !course.isMain).length > 0 && (
            <View>
              <TextN
                text={t('otherCourses')}
                weight="medium"
                style={{marginBottom: 8}}
              />
              {courses
                .filter(course => !course.isMain)
                .map(extraCourse => buildCourseButton(extraCourse))}
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
