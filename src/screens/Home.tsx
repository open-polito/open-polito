import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Octicons';
import colors from '../colors';
import TextInput from '../components/TextInput';
import sections from '../sections';
import styles from '../styles';
import {TextS, TextSubTitle} from '../components/Text';
import Header from '../components/Header';
import {useTranslation} from 'react-i18next';
import ScreenContainer from '../components/ScreenContainer';
import LiveWidget from '../components/LiveWidget';
import {useDispatch, useSelector} from 'react-redux';
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';
import {Rect} from 'react-native-svg';
import {RootState} from '../store/store';
import {NavigationProp, useNavigation} from '@react-navigation/core';
import {Status, STATUS} from '../store/status';

export default function Home({navigation}: {navigation: NavigationProp}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const loadUserStatus = useSelector<RootState, Status>(
    state => state.user.loadUserStatus,
  );

  const w =
    Dimensions.get('window').width -
    2 * styles.withHorizontalPadding.paddingHorizontal;

  /**
   * |----CARD--CARD--CARD----|
   * card spacing is half the side padding,
   * so empty space is 3 * padding.
   * Card width is then 1/3 remaining space.
   */
  const [cardWidth] = useState(
    (Dimensions.get('window').width -
      3 * styles.withHorizontalPadding.paddingHorizontal) /
      3,
  );

  // Redirect to section on button press
  const redirect = (sectionName: string) => {
    // Section names are equal to their locale string, with 1st char uppercase
    const screen = sectionName[0].toUpperCase() + sectionName.slice(1);
    screen && navigation.navigate(screen);
  };

  return (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={[colors.gradient1, colors.gradient2]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={{flex: 1}}>
        <ImageBackground source={require('../../assets/images/background.png')}>
          <ScreenContainer
            style={{paddingHorizontal: 0, backgroundColor: null}}
            barStyle="light-content">
            <View style={styles.withHorizontalPadding}>
              <Header text={t('home')} color={colors.white} />
            </View>
            <View
              style={{
                marginBottom: 16,
                ...styles.paddingFromHeader,
                ...styles.withHorizontalPadding,
              }}>
              {/* quick search container */}
              <TextInput
                icon="search"
                placeholder={t('quickSearch')}
                borderColor="none"
                borderWidth={0}
                iconColor={colors.gray}
              />
            </View>
            <View style={styles.withHorizontalPadding}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 16,
                }}>
                {sections.map(section => {
                  const item =
                    loadUserStatus.code == STATUS.SUCCESS ? (
                      <Pressable
                        key={section.name}
                        onPress={() => {
                          redirect(section.name);
                        }}>
                        <View
                          style={{
                            ...styles.elevatedSmooth,
                            borderRadius: 8,
                            width: cardWidth,
                            height: cardWidth / 2,
                            backgroundColor: colors.white,
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            padding: 8,
                          }}>
                          <View style={{flex: 1}}>
                            <Icon
                              name={section.icon}
                              size={cardWidth / 4}
                              color={colors.gradient1}
                            />
                          </View>
                          <View style={{flex: 2}}>
                            <TextS text={t(section.name)} numberOfLines={2} />
                          </View>
                        </View>
                      </Pressable>
                    ) : (
                      <SvgAnimatedLinearGradient
                        height={cardWidth / 2}
                        width={cardWidth}>
                        <Rect
                          x={0}
                          y={0}
                          rx={8}
                          ry={8}
                          width={cardWidth}
                          height={cardWidth / 2}
                        />
                      </SvgAnimatedLinearGradient>
                    );
                  return item;
                })}
              </View>
            </View>
            <ScrollView
              style={{
                backgroundColor: colors.background,
                flex: 1,
                paddingTop: 16,
              }}>
              <View style={styles.withHorizontalPadding}>
                {/* {loadedUser &&
                  [
                    ...user.carico_didattico.corsi,
                    ...user.carico_didattico.extra_courses,
                  ].map(corso => {
                    return corso.live_lessons.map(liveClass => {
                      return (
                        <LiveWidget
                          key={liveClass.meeting_id}
                          liveClass={liveClass}
                          courseName={corso.nome}
                          device={corso.device}
                        />
                      );
                    });
                  })} */}
                {/* <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Image
                    style={{width: '100%', height: 70, borderRadius: 16}}
                    resizeMode="cover"
                    source={require('../../assets/images/update.png')}
                  />
                </View> */}
                <View>
                  {loadUserStatus.code != STATUS.SUCCESS && (
                    <View>
                      <SvgAnimatedLinearGradient
                        height={cardWidth / 1.5}
                        width={w}>
                        <Rect
                          x={0}
                          y={0}
                          rx={8}
                          ry={8}
                          width={w}
                          height={cardWidth / 1.5}
                        />
                      </SvgAnimatedLinearGradient>
                      <SvgAnimatedLinearGradient
                        style={{marginTop: 16}}
                        height={cardWidth / 1.5}
                        width={w}>
                        <Rect
                          x={0}
                          y={0}
                          rx={8}
                          ry={8}
                          width={w}
                          height={cardWidth / 1.5}
                        />
                      </SvgAnimatedLinearGradient>
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          </ScreenContainer>
        </ImageBackground>
      </LinearGradient>
    </View>
  );
}
