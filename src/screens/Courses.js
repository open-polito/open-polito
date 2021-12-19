import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, ScrollView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../colors';
import ArrowHeader from '../components/ArrowHeader';
import ScreenContainer from '../components/ScreenContainer';
import {TextN, TextS} from '../components/Text';
import {UserContext} from '../context/User';
import {setCarico} from '../store/userSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles';

export default function Courses({navigation}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {user} = useContext(UserContext);

  const courses_json = useSelector(state => state.user.carico_didattico);
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    if (courses_json == null) {
      (async () => {
        await user.populate();
        dispatch(setCarico(JSON.stringify(user.carico_didattico)));
        setCourses(user.carico_didattico.corsi);
      })();
    } else {
      setCourses(JSON.parse(courses_json).corsi);
    }
  }, []);

  return (
    <ScreenContainer style={{paddingHorizontal: 0}}>
      <View style={styles.withHorizontalPadding}>
        <ArrowHeader text={t('courses')} backFunc={navigation.goBack} />
      </View>
      <View style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{
            ...styles.withHorizontalPadding,
            flex: 1,
          }}>
          {courses != null &&
            courses.map(course => (
              <View key={course.codice}>
                <Pressable
                  onPress={() => {
                    navigation.navigate('Course', {courseCode: course.codice});
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
                      <TextN
                        text={course.nome}
                        numberOfLines={1}
                        weight="regular"
                      />
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
            ))}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
