import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, View} from 'react-native';
import {useDispatch} from 'react-redux';
import colors from '../colors';
import ArrowHeader from '../components/ArrowHeader';
import ScreenContainer from '../components/ScreenContainer';
import {TextL, TextN, TextS, TextXL} from '../components/Text';
import {UserContext} from '../context/User';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles';
import CourseInfo from '../components/CourseInfo';

export default function Course({navigation, route}) {
  const {t} = useTranslation();
  const {dispatch} = useDispatch();
  const {user} = useContext(UserContext);
  const [courseData, setCourseData] = useState(null);
  const code = route.params.courseCode;

  const [currentTab, setCurrentTab] = useState('info');

  const tabs = [
    {
      name: 'info',
      icon: 'info-outline',
    },
    {
      name: 'videos',
      icon: 'ondemand-video',
    },
  ];

  useEffect(() => {
    if (!user.carico_didattico) {
      user.populate();
    }
    (async () => {
      user.carico_didattico.corsi.forEach(corso => {
        if (corso.codice == code) {
          const _course = corso;
          _course.populate().then(() => {
            setCourseData(_course);
          });
        }
      });
    })();
  }, []);

  return (
    <ScreenContainer>
      <ArrowHeader backFunc={navigation.goBack} />

      {courseData && (
        <View>
          <TextXL
            text={courseData.nome}
            numberOfLines={2}
            weight="medium"
            color={colors.black}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TextL text={code} color={colors.mediumGray} />
            <View style={{flexDirection: 'column'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  borderWidth: 1,
                }}>
                <Icon name="person-outline" color={colors.gray} size={16} />
                <TextS
                  text={courseData.cognome_prof + ' ' + courseData.nome_prof}
                />
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            {tabs.map(tab => (
              <View
                key={tab.name}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Pressable
                  android_ripple={{color: colors.lightGray}}
                  onPress={() => {
                    setCurrentTab(tab.name);
                  }}
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    name={tab.icon}
                    size={32}
                    color={
                      tab.name == currentTab ? colors.gradient1 : colors.gray
                    }
                  />
                </Pressable>
              </View>
            ))}
          </View>

          <View>
            {(() => {
              switch (currentTab) {
                case 'info':
                  return <CourseInfo />;
                  break;
                case 'videos':
                  return <CourseVideos />;
              }
            })()}
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}
