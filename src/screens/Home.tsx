import React, {useContext, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import colors from '../colors';
import {DeviceContext} from '../context/Device';
import {p} from '../scaling';
import TablerIcon from '../ui/core/TablerIcon';
import TextInput from '../ui/core/TextInput';
import Header, {HEADER_TYPE} from '../ui/Header';
import Screen from '../ui/Screen';
import sections from '../sections';
import PressableBase from '../ui/core/PressableBase';
import Text from '../ui/core/Text';
import {useNavigation} from '@react-navigation/native';
import Section from '../ui/Section';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {
  CoursesState,
  getRecentMaterial,
  loadCourse,
  loadCoursesData,
} from '../store/coursesSlice';
import DirectoryItem from '../ui/DirectoryItem';
import {STATUS} from '../store/status';
import Notification from '../ui/Notification';
import {NotificationType} from 'open-polito-api/notifications';

// TODO "quick access" section using recently opened sections
// TODO open search section
// TODO open notification section
// TODO show update widget
// TODO show live classes

const sectionColors = [colors.accent300, colors.red, '#9b51e0', '#f2c94c'];

const Home = () => {
  const {t} = useTranslation();
  const {dark, device} = useContext(DeviceContext);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    courses,
    recentMaterial,
    getRecentMaterialStatus,
    loadCoursesStatus,
    loadExtendedCourseInfoStatus,
  } = useSelector<RootState, CoursesState>(state => state.courses);

  const latestAlert = useMemo(() => {
    return courses
      .flatMap(c => c.extendedInfo?.notices || [])
      .sort((a, b) => b.date - a.date)[0];
  }, [courses]);

  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        marginTop: 24 * p,
        paddingHorizontal: 16 * p,
        paddingBottom: 16 * p,
      },
      topSections: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 16,
      },
      topSection: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      topSectionInner: {
        width: 40 * p,
        height: 40 * p,
        borderRadius: 4 * p,
        marginBottom: 4 * p,
        justifyContent: 'center',
        alignItems: 'center',
      },
      topSectionText: {
        position: 'absolute',
        bottom: -16 * p,
      },
    });
  }, [dark]);

  return (
    <Screen>
      <Header title={t('home')} headerType={HEADER_TYPE.MAIN} />
      <ScrollView>
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
              style={{marginBottom: 32 * p}}
            />
          </PressableBase>

          {/* Top sections */}
          <View style={_styles.topSections}>
            {sections[1].items.map((btn, i) => (
              <PressableBase
                key={btn.name}
                style={_styles.topSection}
                onPress={() => {
                  navigation.navigate(btn.name);
                }}>
                <View
                  style={{
                    ..._styles.topSectionInner,
                    backgroundColor: sectionColors[i],
                  }}>
                  <TablerIcon
                    name={btn.icon}
                    size={24 * p}
                    color={colors.gray100}
                  />
                </View>
                <Text
                  numberOfLines={1}
                  s={10 * p}
                  w="r"
                  c={dark ? colors.gray100 : colors.gray800}
                  style={_styles.topSectionText}>
                  {t(btn.name[0].toLowerCase() + btn.name.slice(1))}
                </Text>
              </PressableBase>
            ))}
            <PressableBase
              style={_styles.topSection}
              onPress={() => {
                navigation.toggleDrawer();
              }}>
              <View
                style={{
                  ..._styles.topSectionInner,
                  borderColor: colors.gray200,
                  borderWidth: 1 * p,
                }}>
                <TablerIcon name="plus" size={24 * p} color={colors.gray200} />
              </View>
              <Text
                numberOfLines={1}
                s={10 * p}
                w="r"
                c={dark ? colors.gray100 : colors.gray800}
                style={_styles.topSectionText}>
                {t('more')}
              </Text>
            </PressableBase>
          </View>

          {/* Latest files */}
          <Section
            dark={dark}
            title={t('latestFiles')}
            style={{marginTop: 32 * p}}>
            {loadExtendedCourseInfoStatus.code != STATUS.SUCCESS ? (
              <ActivityIndicator />
            ) : (
              recentMaterial.slice(0, 3).map(file => (
                <View key={file.code}>
                  <DirectoryItem
                    relativeDate
                    dark={dark}
                    item={file}
                    course={'TODO ADD COURSE NAMES'}
                  />
                </View>
              ))
            )}
          </Section>

          {/* Latest alert */}
          <Section
            dark={dark}
            title={t('latestAlert')}
            style={{marginTop: 24 * p}}>
            {loadExtendedCourseInfoStatus.code != STATUS.SUCCESS ? (
              <ActivityIndicator />
            ) : (
              <Notification
                type={NotificationType.NOTICE}
                notification={latestAlert}
                dark={dark}
              />
            )}
          </Section>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default Home;
