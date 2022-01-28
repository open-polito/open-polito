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
  const [cardWidth] = useState(
    (Dimensions.get('window').width -
      3 * styles.withHorizontalPadding.paddingHorizontal) /
      3,
  );

  // Redirect to section on button press
  const redirect = sectionName => {
    // Section names are equal to their locale string, with 1st char uppercase
    screen = sectionName[0].toUpperCase() + sectionName.slice(1);
    screen && navigation.navigate(screen);
  };

  useEffect(() => {
    (async () => {
      if (!loadingUser) {
        dispatch(setLoadingUser(true));
        await user.populate();

        let promises = [];

        [
          ...user.carico_didattico.corsi,
          ...user.carico_didattico.extra_courses,
        ].forEach(corso => {
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
    <View style={{flex: 1}}>
      <LinearGradient
        colors={[colors.gradient1, colors.gradient2]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        height={height}>
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
                  const item = loadedUser ? (
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
                {loadedUser &&
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
                  })}
                {/* <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Image
                    style={{width: '100%', height: 70, borderRadius: 16}}
                    resizeMode="cover"
                    source={require('../../assets/images/update.png')}
                  />
                </View> */}
                <View>
                  {!loadedUser && (
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

  // Old home screen UI code
  // TODO delete it when new home screen finished
  // return (
  //   <LinearGradient
  //     colors={[colors.gradient1, colors.gradient2]}
  //     start={{x: 0, y: 0}}
  //     end={{x: 1, y: 1}}
  //     height={height}>
  //     <ImageBackground source={require('../../assets/images/background.png')}>
  //       <ScreenContainer
  //         barStyle="light-content"
  //         style={{backgroundColor: 'rgba(0, 0, 0, 0)', paddingHorizontal: 0}}>
  //         <ScrollView>
  //           {/* blue section / white section container */}
  //           <View
  //             style={{
  //               ...styles.withHorizontalPadding,
  //               marginBottom: 20,
  //               borderRadius: 16,
  //             }}>
  //             {/* blue section */}
  //             <Header color={colors.white} text={t('home')} />
  //             <View style={{marginBottom: 16, ...styles.paddingFromHeader}}>
  //               {/* quick search container */}
  //               <TextInput
  //                 icon="search"
  //                 placeholder={t('quickSearch')}
  //                 borderColor="none"
  //                 borderWidth={0}
  //                 iconColor={colors.gray}
  //               />
  //             </View>
  //             <View>
  //               {/* quick access section */}
  //               <View
  //                 style={{
  //                   flexDirection: 'row',
  //                   justifyContent: 'space-between',
  //                   alignItems: 'center',
  //                   marginBottom: 16,
  //                 }}>
  //                 <View
  //                   style={{
  //                     flexDirection: 'row',
  //                     alignItems: 'center',
  //                   }}>
  //                   <Icon name="bookmark" size={24} color={colors.white} />
  //                   <TextSubTitle
  //                     text={t('quickAccess')}
  //                     color={colors.white}
  //                   />
  //                 </View>
  //                 <View>
  //                   <TextSubTitle text={t('edit')} color={colors.white} />
  //                 </View>
  //               </View>
  //               <View
  //                 style={{
  //                   flexDirection: 'row',
  //                   justifyContent: 'space-between',
  //                 }}>
  //                 {/* quick access categories container */}
  //                 {loadedUser ? (
  //                   sections.quickAccess.map(qaSection => {
  //                     return (
  //                       <CategoryCard
  //                         key={qaSection}
  //                         category={t(qaSection)}
  //                         size={cardWidth}
  //                         onPress={() => {
  //                           let screen = '';
  //                           switch (qaSection) {
  //                             case 'courses':
  //                               screen = 'Courses';
  //                               break;
  //                             case 'examSessions':
  //                               screen = 'ExamSessions';
  //                               break;
  //                           }
  //                           screen && navigation.navigate(screen);
  //                         }}
  //                       />
  //                     );
  //                   })
  //                 ) : (
  //                   <SvgAnimatedLinearGradient height={cardWidth} width={w}>
  //                     <Rect
  //                       x={0}
  //                       y={0}
  //                       rx={8}
  //                       ry={8}
  //                       width={w}
  //                       height={cardWidth}
  //                     />
  //                   </SvgAnimatedLinearGradient>
  //                 )}
  //               </View>
  //             </View>
  //           </View>
  //           <View
  //             style={{
  //               backgroundColor: colors.white,
  //             }}>
  //             {/* white section container */}
  //             <View
  //               style={{
  //                 ...styles.withHorizontalPadding,
  //                 paddingTop: 16,
  //                 height: '100%',
  //               }}>
  //               {loadedUser &&
  //                 [
  //                   ...user.carico_didattico.corsi,
  //                   ...user.carico_didattico.extra_courses,
  //                 ].map(corso => {
  //                   return corso.live_lessons.map(liveClass => {
  //                     return (
  //                       <LiveWidget
  //                         key={liveClass.meeting_id}
  //                         liveClass={liveClass}
  //                         courseName={corso.nome}
  //                         device={corso.device}
  //                       />
  //                     );
  //                   });
  //                 })}
  //               <TextSubTitle
  //                 style={{marginBottom: 16}}
  //                 text={t('allSections')}
  //                 color={colors.black}
  //               />
  //               <View style={{height: 50}}></View>
  //             </View>
  //           </View>
  //         </ScrollView>
  //       </ScreenContainer>
  //     </ImageBackground>
  //   </LinearGradient>
  // );
}
