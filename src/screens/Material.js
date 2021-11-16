import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {SafeAreaView, StatusBar, View} from 'react-native';
import styles from '../styles';
import colors from '../colors';
import Header from '../components/Header';
import {useSelector} from 'react-redux';
import TextInput from '../components/TextInput';
import {TextN, TextSubTitle} from '../components/Text';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';
import {useContext} from 'react';
import {UserContext} from '../context/User';
import CourseSelector from '../components/CourseSelector';
import RecentItems from '../components/RecentItems';
import RecentItemsLoader from '../components/RecentItemsLoader';
import {Rect} from 'react-native-svg';

export default function Material() {
  const {t} = useTranslation();
  const {windowHeight} = useSelector(state => state.ui);

  const {user} = useContext(UserContext);

  const [selectorLoaded, setSelectorLoaded] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    (async () => {
      await user.populate();
      setSelectorLoaded(true);
    })();
  }, []);

  function selectCourse(course_id) {
    setSelectedCourse(course_id);
  }

  return (
    <SafeAreaView style={{height: windowHeight - styles.tabNavigator.height}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View
        style={{
          ...styles.container,
          ...styles.safePaddingTop,
          ...styles.withHorizontalPadding,
          backgroundColor: colors.white,
          height: windowHeight,
        }}>
        <Header text={t('material')} noMarginBottom={true} />
        <View style={{marginBottom: 16}}>
          {/* search container */}
          <TextInput
            icon="search"
            placeholder={t('searchMaterial')}
            borderColor="none"
            borderWidth={0}
            iconColor={colors.gray}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon name="history" size={24} color={colors.black} />
          <TextSubTitle
            text={t('recentMaterial')}
            color={colors.black}
            style={{marginLeft: 4}}
          />
        </View>
        {selectorLoaded ? <RecentItems /> : <RecentItemsLoader />}
        <View>
          <TextN text="byCourse" />
          {selectorLoaded ? (
            <CourseSelector
              courses={user.carico_didattico.corsi}
              selector={selectCourse}
            />
          ) : (
            <SvgAnimatedLinearGradient height={32} width={400}>
              <Rect x="0" y="0" rx="4" ry="4" width="75" height="24" />
              <Rect x="85" y="0" rx="4" ry="4" width="150" height="24" />
              <Rect x="250" y="0" rx="4" ry="4" width="100" height="24" />
            </SvgAnimatedLinearGradient>
          )}
          {selectedCourse == null ? (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TextN text="selectCourse" />
            </View>
          ) : (
            <TextN text="Loading here..." />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
