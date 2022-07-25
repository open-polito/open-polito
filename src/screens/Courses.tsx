import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../colors';
import ArrowHeader from '../components/ArrowHeader';
import ScreenContainer from '../components/ScreenContainer';
import {TextN, TextS} from '../components/Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles';
import {DeviceContext} from '../context/Device';
import {AppDispatch, RootState} from '../store/store';
import {CourseState} from '../store/coursesSlice';
import Screen from '../ui/Screen';
import {p} from '../scaling';
import Header, {HEADER_TYPE} from '../ui/Header';
import PressableBase from '../ui/core/PressableBase';
import Text from '../ui/core/Text';
import TablerIcon from '../ui/core/TablerIcon';
import Section from '../ui/Section';

export default function Courses({navigation}) {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const {device, dark} = useContext(DeviceContext);

  const courses = useSelector<RootState, CourseState[]>(
    state => state.courses.courses,
  );

  const [offsetY, setOffsetY] = useState(0);

  const buildCourseButton = (course: CourseState) => {
    return (
      <View key={course.basicInfo.code + course.basicInfo.name}>
        <PressableBase
          onPress={() => {
            navigation.navigate('Course', {
              courseCode: course.basicInfo.code + course.basicInfo.name,
            });
          }}
          android_ripple={{color: colors.lightGray}}
          style={_styles.button}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text s={12 * p} c={dark ? colors.gray200 : colors.gray700} w="m">
              {course.basicInfo.name}
            </Text>
            <TablerIcon
              name="chevron-right"
              color={dark ? colors.gray200 : colors.gray700}
              size={24 * p}
            />
          </View>
        </PressableBase>
      </View>
    );
  };

  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        marginTop: 24 * p,
        paddingHorizontal: 16 * p,
        paddingBottom: 16 * p,
      },
      button: {
        paddingVertical: 8 * p,
        paddingLeft: 16 * p,
        paddingRight: 8 * p,
        marginBottom: 16 * p,
        backgroundColor: dark ? colors.gray700 : colors.gray200,
        borderRadius: 4 * p,
      },
    });
  }, [dark]);

  return (
    <Screen>
      <Header title={t('courses')} headerType={HEADER_TYPE.MAIN} />
      <ScrollView>
        <View style={_styles.container}>
          {courses
            .filter(course => course.isMain)
            .map(mainCourse => buildCourseButton(mainCourse))}
          {courses.filter(course => !course.isMain).length > 0 ? (
            <Section
              dark={dark}
              title={t('otherCourses')}
              style={{marginTop: 8}}>
              {courses
                .filter(course => !course.isMain)
                .map(secondaryCourse => buildCourseButton(secondaryCourse))}
            </Section>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}
