import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';
import {TextN, TextS} from './Text';

export default function CourseInfo({data}) {
  const {t} = useTranslation();
  return (
    <View
      style={{
        flex: 1,
        marginBottom: 32,
      }}>
      <ScrollView>
        {data.map((section, index) => {
          return (
            <View key={index}>
              <TextN text={section.title} weight="medium" />
              <TextS text={section.text} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
