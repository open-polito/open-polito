import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
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

export default function Home() {
  const {t} = useTranslation();
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

  /**
   * The status bar doesn't return to light mode
   * when returning to Home screen.
   * TODO fix
   */
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  });

  return (
    <LinearGradient
      colors={[colors.gradient1, colors.gradient2]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      height={height}>
      <ImageBackground source={require('../../assets/images/background.png')}>
        <SafeAreaView style={{height: height - styles.tabNavigator.height}}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <View
            style={{
              ...styles.container,
              ...styles.safePaddingTop,
            }}>
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
                <View style={{marginBottom: 16}}>
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
                    {sections.quickAccess.map(qaSection => {
                      return (
                        <CategoryCard
                          key={qaSection}
                          category={t(qaSection)}
                          size={cardWidth}
                        />
                      );
                    })}
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
          </View>
        </SafeAreaView>
      </ImageBackground>
    </LinearGradient>
  );
}
