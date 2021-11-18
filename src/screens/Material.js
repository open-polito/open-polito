import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import styles from '../styles';
import colors from '../colors';
import Header from '../components/Header';
import {useDispatch, useSelector} from 'react-redux';
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
import {setCarico} from '../store/userSlice';
import {getMaterialTree, getRecentMaterial} from '../utils/material';
import {setMaterial, setRecentMaterial} from '../store/materialSlice';
import MaterialExplorer from '../components/MaterialExplorer';

export default function Material() {
  const {t} = useTranslation();
  // const {windowHeight} = useSelector(state => state.ui);
  const [height] = useState(
    Dimensions.get('window').height + StatusBar.currentHeight,
  );
  const {carico_didattico} = useSelector(state => state.user);
  const material = useSelector(state => state.material.material);
  const carico =
    carico_didattico == null ? carico_didattico : JSON.parse(carico_didattico);

  const dispatch = useDispatch();

  const {user} = useContext(UserContext);

  const [selectorLoaded, setSelectorLoaded] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    if (carico == null) {
      (async () => {
        await user.populate();
        dispatch(setCarico(JSON.stringify(user.carico_didattico)));
        setSelectorLoaded(true);
        loadMaterialIfNull();
      })();
    } else {
      setSelectorLoaded(true);
      loadMaterialIfNull();
    }
  }, []);

  function loadMaterialIfNull() {
    if (material == null) {
      getMaterialTree(user).then(data => {
        dispatch(setMaterial(data));
        dispatch(
          setRecentMaterial(getRecentMaterial(user.carico_didattico, data)),
        );
      });
    }
  }

  function selectCourse(course_id) {
    setSelectedCourse(course_id);
  }

  return (
    <SafeAreaView style={{height: height - styles.tabNavigator.height}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View
        style={{
          ...styles.container,
          ...styles.safePaddingTop,
          backgroundColor: colors.white,
        }}>
        <View style={styles.withHorizontalPadding}>
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
        </View>
        <ScrollView contentContainerStyle={styles.withHorizontalPadding}>
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
            <TextSubTitle text={t('byCourse')} />
            {selectorLoaded ? (
              <CourseSelector courses={carico.corsi} selector={selectCourse} />
            ) : (
              <SvgAnimatedLinearGradient height={32} width={400}>
                <Rect x="0" y="0" rx="4" ry="4" width="75" height="24" />
                <Rect x="85" y="0" rx="4" ry="4" width="150" height="24" />
                <Rect x="250" y="0" rx="4" ry="4" width="100" height="24" />
              </SvgAnimatedLinearGradient>
            )}
          </View>
          {selectedCourse == null ? (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TextN text={t('selectCourse')} />
            </View>
          ) : (
            <MaterialExplorer course={selectedCourse} />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
