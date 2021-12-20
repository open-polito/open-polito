import React, {useContext, useEffect, useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import colors from '../colors';
import ArrowHeader from '../components/ArrowHeader';
import ScreenContainer from '../components/ScreenContainer';
import {TextL, TextS, TextXL} from '../components/Text';
import {UserContext} from '../context/User';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconC from 'react-native-vector-icons/MaterialCommunityIcons';
import CourseVideos from '../components/CourseVideos';
import styles from '../styles';
import {useTranslation} from 'react-i18next';
import CourseOverview from '../components/CourseOverview';
import MaterialExplorer from '../components/MaterialExplorer';
import {useDispatch, useSelector} from 'react-redux';
import {getMaterialTree, getRecentMaterial} from '../utils/material';
import {setMaterial, setRecentMaterial} from '../store/materialSlice';
import RecentItemsLoader from '../components/RecentItemsLoader';
import CourseLoader from '../components/CourseLoader';
import CourseAlerts from '../components/CourseAlerts';

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
      icon: 'video-outline',
    },
    {
      name: 'alerts',
      icon: 'bell-alert-outline',
    },
  ];

  useEffect(() => {
    if (!user.carico_didattico) {
      user.populate();
    }
    (async () => {
      user.carico_didattico.corsi.forEach(corso => {
        if (corso.codice + corso.nome == code) {
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
    <ScreenContainer style={{paddingHorizontal: 0}}>
      <View style={styles.withHorizontalPadding}>
        <ArrowHeader backFunc={navigation.goBack} />
      </View>
      {courseData ? (
        <View style={{flex: 1}}>
          <View style={styles.withHorizontalPadding}>
            <TextXL
              text={courseData.nome}
              numberOfLines={2}
              weight="medium"
              color={colors.black}
            />
          </View>
          <View
            style={{
              ...styles.withHorizontalPadding,
              flexDirection: 'column',
            }}>
            <TextL text={courseData.codice} color={colors.mediumGray} />
            <View style={{flexDirection: 'column', marginTop: 16}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <Icon name="person-outline" color={colors.gray} size={16} />
                <TextS
                  style={{marginLeft: 4}}
                  text={courseData.cognome_prof + ' ' + courseData.nome_prof}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <IconC
                  name="star-four-points-outline"
                  color={colors.gray}
                  size={16}
                />
                <TextS style={{marginLeft: 4}} text={courseData.cfu + ' CFU'} />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <IconC name="calendar" color={colors.gray} size={16} />
                <TextS
                  style={{marginLeft: 4}}
                  text={'A.A. ' + courseData.anno_accademico}
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
              marginHorizontal: styles.withHorizontalPadding.paddingHorizontal,
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
                  <IconC
                    name={tab.icon}
                    size={24}
                    color={
                      tab.name == currentTab ? colors.gradient1 : colors.gray
                    }
                  />
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
                return (
                  <CourseOverview
                    courseData={courseData}
                    changeTab={setCurrentTab}
                  />
                );
              case 'material':
                return materialLoaded ? (
                  <ScrollView
                    contentContainerStyle={styles.withHorizontalPadding}>
                    <MaterialExplorer
                      course={courseData.codice + courseData.nome}
                    />
                  </ScrollView>
                ) : (
                  <RecentItemsLoader />
                );
              case 'alerts':
                return (
                  <View style={{...styles.withHorizontalPadding, flex: 1}}>
                    <CourseAlerts alerts={courseData.avvisi} />
                  </View>
                );
              case 'recordings':
                return (
                  <View style={{...styles.withHorizontalPadding, flex: 1}}>
                    <CourseVideos videos={courseData.vc_recordings.current} />
                  </View>
                );
            }
          })()}
        </View>
      ) : (
        <CourseLoader />
      )}
    </ScreenContainer>
  );
}
