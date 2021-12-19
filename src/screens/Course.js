import React, {useContext, useEffect, useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import colors from '../colors';
import ArrowHeader from '../components/ArrowHeader';
import ScreenContainer from '../components/ScreenContainer';
import {TextL, TextS, TextXL} from '../components/Text';
import {UserContext} from '../context/User';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconC from 'react-native-vector-icons/MaterialCommunityIcons';
import CourseInfo from '../components/CourseInfo';
import CourseVideos from '../components/CourseVideos';
import styles from '../styles';
import {useTranslation} from 'react-i18next';
import CourseOverview from '../components/CourseOverview';
import MaterialExplorer from '../components/MaterialExplorer';
import {useDispatch, useSelector} from 'react-redux';
import {getMaterialTree, getRecentMaterial} from '../utils/material';
import {setMaterial, setRecentMaterial} from '../store/materialSlice';
import RecentItemsLoader from '../components/RecentItemsLoader';

export default function Course({navigation, route}) {
  const dispatch = useDispatch();

  const {t} = useTranslation();

  const {user} = useContext(UserContext);
  const [courseData, setCourseData] = useState(null);
  const [mounted, setMounted] = useState(true);
  const code = route.params.courseCode;

  const [currentTab, setCurrentTab] = useState('overview');
  const [materialLoaded, setMaterialLoaded] = useState(false);
  const material = useSelector(state => state.material.material);

  // TODO extract function
  function loadMaterialIfNull() {
    if (material == null) {
      getMaterialTree(user).then(data => {
        dispatch(setMaterial(data));
        dispatch(
          setRecentMaterial(getRecentMaterial(user.carico_didattico, data)),
        );
        if (mounted) {
          setMaterialLoaded(true);
        }
      });
    } else {
      setMaterialLoaded(true);
    }
  }

  const tabs = [
    {
      name: 'overview',
      icon: 'apps',
    },
    {
      name: 'material',
      icon: 'file-outline',
    },
    {
      name: 'recordings',
      icon: 'videocam',
    },
    {
      name: 'videos',
      icon: 'ondemand-video',
    },
    {
      name: 'info',
      icon: 'info-outline',
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
    loadMaterialIfNull();
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
              marginVertical: 16,
              flexDirection: 'row',
              justifyContent: 'space-around',
              backgroundColor: colors.white,
              borderRadius: 16,
              ...styles.elevatedSmooth,
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
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingVertical: 12,
                  }}>
                  {tab.name == 'material' ? (
                    <IconC
                      name={tab.icon}
                      size={24}
                      color={
                        tab.name == currentTab ? colors.gradient1 : colors.gray
                      }
                    />
                  ) : (
                    <Icon
                      name={tab.icon}
                      size={24}
                      color={
                        tab.name == currentTab ? colors.gradient1 : colors.gray
                      }
                    />
                  )}
                  <TextS
                    text={t(tab.name)}
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
              case 'overview':
                return <CourseOverview courseData={courseData} />;
              case 'material':
                return materialLoaded ? (
                  <ScrollView>
                    <MaterialExplorer course={courseData.codice} />
                  </ScrollView>
                ) : (
                  <RecentItemsLoader />
                );

              case 'info':
                return <CourseInfo data={courseData.info} />;
              case 'recordings':
                return (
                  <CourseVideos videos={courseData.vc_recordings.current} />
                );
              case 'videos':
                return <CourseVideos videos={courseData.videolezioni} />;
            }
          })()}
        </View>
      )}
    </ScreenContainer>
  );
}
