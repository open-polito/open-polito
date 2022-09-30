import React, {useCallback, useContext, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {DeviceContext} from '../context/Device';
import {RootState} from '../store/store';
import {CourseState} from '../store/coursesSlice';
import Screen from '../ui/Screen';
import {p} from '../scaling';
import Header, {HEADER_TYPE} from '../ui/Header';
import Section from '../ui/Section';
import PressableCard from '../ui/core/PressableCard';

export default function Courses({navigation}) {
  const {t} = useTranslation();
  const {dark} = useContext(DeviceContext);

  const courses = useSelector<RootState, CourseState[]>(
    state => state.courses.courses,
  );

  const gotoCourse = useCallback(
    (course: CourseState) => {
      navigation.navigate('Course', {
        courseCode: course.basicInfo.code + course.basicInfo.name,
      });
    },
    [navigation],
  );

  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        marginTop: 24 * p,
        paddingHorizontal: 16 * p,
        paddingBottom: 16 * p,
      },
    });
  }, []);

  return (
    <Screen>
      <Header title={t('courses')} headerType={HEADER_TYPE.MAIN} />
      <ScrollView>
        <View style={_styles.container}>
          {courses
            .filter(course => course.isMain)
            .map(mainCourse => (
              <PressableCard
                dark={dark}
                onPress={() => gotoCourse(mainCourse)}
                key={mainCourse.basicInfo.code + mainCourse.basicInfo.name}
                title={mainCourse.basicInfo.name}
              />
            ))}
          {courses.filter(course => !course.isMain).length > 0 ? (
            <Section
              dark={dark}
              title={t('otherCourses')}
              style={{marginTop: 8}}>
              {courses
                .filter(course => !course.isMain)
                .map(secondaryCourse => (
                  <PressableCard
                    dark={dark}
                    onPress={() => gotoCourse(secondaryCourse)}
                    key={
                      secondaryCourse.basicInfo.code +
                      secondaryCourse.basicInfo.name
                    }
                    title={secondaryCourse.basicInfo.name}
                  />
                ))}
            </Section>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}
