import React, {useContext, useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {DeviceContext} from '../context/Device';
import {p} from '../scaling';
import Header, {HEADER_TYPE} from '../ui/Header';
import Screen from '../ui/Screen';
import Section from '../ui/Section';
import {Downloader} from '../utils/downloader/downloader';

const UsageWidget = () => {};

const Downloads = () => {
  const {dark} = useContext(DeviceContext);

  useEffect(() => {
    Downloader.init();
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingTop: 24 * p,
          flex: 1,
        },
        paddingHorizontal: {
          paddingHorizontal: 16 * p,
        },
        list: {
          paddingHorizontal: 16 * p,
          paddingBottom: 24 * p,
        },
      }),
    [],
  );

  return (
    <Screen>
      <Header title="Downloads" headerType={HEADER_TYPE.MAIN} />
      <View style={[styles.container, styles.paddingHorizontal]}>
        <Section title="Usage" dark></Section>
        <Section title={`Downloading (15%)`} dark={dark}></Section>
        <Section title={`Downloading (15%)`} dark={dark}></Section>
      </View>
    </Screen>
  );
};

export default Downloads;
