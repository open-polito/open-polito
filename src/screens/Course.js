import React, {useContext, useEffect, useState} from 'react';
import {Pressable, View} from 'react-native';
import colors from '../colors';
import ArrowHeader from '../components/ArrowHeader';
import ScreenContainer from '../components/ScreenContainer';
import {TextL, TextS, TextXL} from '../components/Text';
import {UserContext} from '../context/User';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CourseInfo from '../components/CourseInfo';
import CourseVideos from '../components/CourseVideos';

export default function Course({navigation, route}) {
  const {user} = useContext(UserContext);
  const [courseData, setCourseData] = useState(null);
  const [mounted, setMounted] = useState(true);
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
            mounted && setCourseData(_course);
          });
        }
      });
    })();
    return () => {
      setMounted(false);
    };
  }, []);

  return (
    <ScreenContainer>
      <ArrowHeader backFunc={navigation.goBack} />
      {courseData && (
        <View style={{flex: 1}}>
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
                }}>
                <Icon name="person-outline" color={colors.gray} size={16} />
                <TextS
                  text={courseData.cognome_prof + ' ' + courseData.nome_prof}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
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
                    paddingVertical: 16,
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
          {(() => {
            switch (currentTab) {
              case 'info':
                return <CourseInfo />;
              case 'videos':
                return <CourseVideos videos={courseData.videolezioni} />;
            }
          })()}
        </View>
      )}
    </ScreenContainer>
  );
}
