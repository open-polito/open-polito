import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, ScrollView, View} from 'react-native';
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
import RecentItems from '../components/RecentItems';
import RecentItemsLoader from '../components/RecentItemsLoader';
import {Rect} from 'react-native-svg';
import {setCarico} from '../store/userSlice';
import {getMaterialTree, getRecentMaterial} from '../utils/material';
import {
  setLoadingMaterial,
  setMaterial,
  setRecentMaterial,
} from '../store/materialSlice';
import MaterialExplorer from '../components/MaterialExplorer';
import ScreenContainer from '../components/ScreenContainer';
import DropdownSelector from '../components/DropdownSelector';

export default function Material({navigation}) {
  const {t} = useTranslation();
  const {carico_didattico} = useSelector(state => state.user);
  const material = useSelector(state => state.material.material);
  const loadingMaterial = useSelector(state => state.material.loadingMaterial);
  const carico =
    carico_didattico == null ? carico_didattico : JSON.parse(carico_didattico);

  const dispatch = useDispatch();

  const {user} = useContext(UserContext);

  const [allLoaded, setAllLoaded] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [mounted, setMounted] = useState(true);

  const [dropdownItems, setDropdownItems] = useState([]);

  const initDropdown = () => {
    let items = [];
    [
      ...user.carico_didattico.corsi,
      ...user.carico_didattico.extra_courses,
    ].forEach(course => {
      items.push({
        label: course.nome,
        value: course.codice + course.nome,
      });
    });
    setDropdownItems(items);
  };

  useEffect(() => {
    if (carico == null) {
      (async () => {
        await user.populate();
        dispatch(setCarico(JSON.stringify(user.carico_didattico)));
        loadMaterialIfNull();
        initDropdown();
      })();
    } else {
      loadMaterialIfNull();
      setAllLoaded(true);
      initDropdown();
    }
    return () => {
      setMounted(false);
    };
  }, []);

  // TODO extract function
  function loadMaterialIfNull() {
    if (material == null && !loadingMaterial) {
      dispatch(setLoadingMaterial(true));
      getMaterialTree(user).then(data => {
        dispatch(setMaterial(data));
        dispatch(
          setRecentMaterial(getRecentMaterial(user.carico_didattico, data)),
        );
        if (mounted) {
          setAllLoaded(true);
        }
      });
    }
  }

  return (
    <ScreenContainer style={{paddingHorizontal: 0}}>
      <View style={styles.withHorizontalPadding}>
        <Header text={t('material')} noMarginBottom={true} />
        <View style={{marginBottom: 16, ...styles.paddingFromHeader}}>
          {/* search container */}
          {allLoaded && (
            <Pressable
              onPress={() => {
                navigation.navigate('MaterialSearch');
              }}>
              <TextInput
                icon="search"
                placeholder={t('searchMaterial')}
                borderColor="none"
                borderWidth={0}
                iconColor={colors.gray}
                editable={false}
              />
            </Pressable>
          )}
        </View>
      </View>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            ...styles.withHorizontalPadding,
          }}>
          <Icon name="history" size={24} color={colors.black} />
          <TextSubTitle
            text={t('recentMaterial')}
            color={colors.black}
            style={{marginLeft: 4}}
          />
        </View>
        <View style={styles.withHorizontalPadding}>
          {allLoaded ? <RecentItems relative_date /> : <RecentItemsLoader />}
        </View>
        <View
          style={{
            ...styles.withHorizontalPadding,
            marginTop: 16,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TextSubTitle style={{flex: 1}} text={t('byCourse')} />
          {allLoaded ? (
            <View
              style={{
                flex: 2,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <DropdownSelector
                items={dropdownItems}
                placeholder={{label: t('selectCourseDropdown'), value: null}}
                onValueChange={value => {
                  setSelectedCourse(value ? value : null);
                }}
              />
            </View>
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
              ...styles.withHorizontalPadding,
            }}>
            <TextN style={{marginTop: 16}} text={t('selectCourse')} />
          </View>
        ) : (
          <View style={styles.withHorizontalPadding}>
            <MaterialExplorer course={selectedCourse} />
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
