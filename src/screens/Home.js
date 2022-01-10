import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../colors';
import TextInput from '../components/TextInput';
import sections from '../sections';
import CategoryCard from '../components/CategoryCard';
import styles from '../styles';
import {TextSubTitle} from '../components/Text';
import Header from '../components/Header';
import {useTranslation} from 'react-i18next';
import ScreenContainer from '../components/ScreenContainer';
import LiveWidget from '../components/LiveWidget';
import {UserContext} from '../context/User';
import {useDispatch, useSelector} from 'react-redux';
import {setLoadedUser, setLoadingUser} from '../store/userSlice';
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';
import {Rect} from 'react-native-svg';

export default function Home({navigation}) {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const {user} = useContext(UserContext);
  const loadingUser = useSelector(state => state.user.loadingUser);
  const loadedUser = useSelector(state => state.user.loadedUser);

  const [mounted, setMounted] = useState(true);

  const w =
    Dimensions.get('window').width -
    2 * styles.withHorizontalPadding.paddingHorizontal;

  const [height] = useState(
    Dimensions.get('window').height + StatusBar.currentHeight,
  );

  /**
   * |----CARD--CARD--CARD----|
   * card spacing is half the side padding,
   * so empty space is 3 * padding.
   * Card width is then 1/3 remaining space.
   */
  const [cardMargin] = useState(
    styles.withHorizontalPadding.paddingHorizontal / 2,
  );
  const [cardWidth] = useState(
    (Dimensions.get('window').width -
      3 * styles.withHorizontalPadding.paddingHorizontal) /
      3,
  );

  useEffect(() => {
    (async () => {
      if (!loadingUser) {
        dispatch(setLoadingUser(true));
        await user.populate();

        let promises = [];

        user.carico_didattico.corsi.forEach(corso => {
          promises.push(corso.populate());
        });

        await Promise.all(promises);

        dispatch(setLoadedUser(true));
      }
    })();
    return () => {
      setMounted(false);
    };
  }, []);

  return (
    <LinearGradient
      colors={[colors.gradient1, colors.gradient2]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      height={height}>
      <ImageBackground source={require('../../assets/images/background.png')}>
        <ScreenContainer
          barStyle="light-content"
          style={{backgroundColor: 'rgba(0, 0, 0, 0)', paddingHorizontal: 0}}>
          <ScrollView>
            {/* blue section / white section container */}
            <View
              style={{
                ...styles.withHorizontalPadding,
                marginBottom: 20,
                borderRadius: 16,
              }}>
              {/* blue section */}
              <Header color={colors.white} text={t('home')} />
              <View style={{marginBottom: 16, ...styles.paddingFromHeader}}>
                {/* quick search container */}
                <TextInput
                  icon="search"
                  placeholder={t('quickSearch')}
                  borderColor="none"
                  borderWidth={0}
                  iconColor={colors.gray}
                />
              </View>
              <View>
                {/* quick access section */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Icon name="bookmark" size={24} color={colors.white} />
                    <TextSubTitle
                      text={t('quickAccess')}
                      color={colors.white}
                    />
                  </View>
                  <View>
                    <TextSubTitle text={t('edit')} color={colors.white} />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {/* quick access categories container */}
                  {loadedUser ? (
                    sections.quickAccess.map(qaSection => {
                      return (
                        <CategoryCard
                          key={qaSection}
                          category={t(qaSection)}
                          size={cardWidth}
                          onPress={() => {
                            let screen = '';
                            switch (qaSection) {
                              case 'courses':
                                screen = 'Courses';
                                break;
                              case 'examSessions':
                                screen = 'ExamSessions';
                                break;
                            }
                            screen && navigation.navigate(screen);
                          }}
                        />
                      );
                    })
                  ) : (
                    <SvgAnimatedLinearGradient height={cardWidth} width={w}>
                      <Rect
                        x={0}
                        y={0}
                        rx={8}
                        ry={8}
                        width={w}
                        height={cardWidth}
                      />
                    </SvgAnimatedLinearGradient>
                  )}
                </View>
              </View>
            </View>
            <View
              style={{
                backgroundColor: colors.white,
              }}>
              {/* white section container */}
              <View
                style={{
                  ...styles.withHorizontalPadding,
                  paddingTop: 16,
                  height: '100%',
                }}>
                {loadedUser &&
                  user.carico_didattico.corsi.map(corso => {
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
                  })}
                <TextSubTitle
                  style={{marginBottom: 16}}
                  text={t('allSections')}
                  color={colors.black}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 250,
                  }}>
                  {/* quick access categories container */}
                  {sections.other.map(qaSection => {
                    return (
                      <CategoryCard
                        key={qaSection}
                        category={qaSection}
                        size={cardWidth}
                        style={{marginBottom: cardMargin}}
                      />
                    );
                  })}
                </View>
                <View style={{height: 50}}></View>
              </View>
            </View>
          </ScrollView>
        </ScreenContainer>
      </ImageBackground>
    </LinearGradient>
  );
}
