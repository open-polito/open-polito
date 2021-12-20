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
        marginBottom: 16,
      }}>
      <ScrollView>
        {data.map((section, index) => {
          return (
            <View
              key={index}
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}>
              <TextN
                text={section.title}
                weight="medium"
                style={{borderBottomWidth: 1, marginTop: index != 0 ? 12 : 0}}
              />
              <TextS text={section.text.trim()} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
