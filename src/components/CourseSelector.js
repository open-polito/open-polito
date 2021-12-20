import React, {useState} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import colors from '../colors';
import {TextS} from './Text';

export default function CourseSelector({courses, selector}) {
  const [selected, setSelected] = useState(null);

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      contentContainerStyle={{
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        paddingVertical: 8,
      }}>
      <View style={{paddingLeft: 24}} />
      {courses.map(course => {
        const color =
          selected == course.codice + course.nome
            ? colors.gradient1
            : colors.white;
        return (
          <Pressable
            key={course.codice + course.nome}
            android_ripple={{color: '#fff'}}
            style={{
              elevation: 4,
              backgroundColor: color,
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 4,
              marginRight: 8,
              maxHeight: 24,
            }}
            onPress={() => {
              // set selected local state
              // then use parent component's change function
              setSelected(course.codice + course.nome);
              selector(course.codice + course.nome);
            }}>
            <View style={{height: '100%'}}>
              <TextS
                text={course.nome}
                color={color == colors.gradient1 ? colors.white : colors.black}
              />
            </View>
          </Pressable>
        );
      })}
      <View style={{paddingRight: 16}} />
    </ScrollView>
  );
}
