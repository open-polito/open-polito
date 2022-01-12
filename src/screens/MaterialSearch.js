import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import colors from '../colors';
import styles from '../styles';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {getMaterialList} from '../utils/material';
import DirectoryItem from '../components/DirectoryItem';
import {TextS, TextSubTitle} from '../components/Text';
import ScreenContainer from '../components/ScreenContainer';
import DropdownSelector from '../components/DropdownSelector';

export default function MaterialSearch({navigation}) {
  const {t} = useTranslation();
  const [query, setQuery] = useState(null);
  const [materialList, setMaterialList] = useState([]);
  const [results, setResults] = useState([]);
  const carico_didattico = JSON.parse(
    useSelector(state => state.user.carico_didattico),
  );
  const material = useSelector(state => state.material.material);

  const inputRef = useRef(null);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
    setMaterialList(getMaterialList(carico_didattico, material));
    initDropdown();
  }, []);

  useEffect(() => {
    searchMaterial();
  }, [selectedCourse]);

  async function searchMaterial() {
    await setTimeout(() => {
      setLoading(true);
    });

    await setTimeout(() => {
      let res = [];
      if (query == '') {
        return;
      }
      materialList.forEach(item => {
        if ((item.nome + item.filename).toLowerCase().includes(query)) {
          if (selectedCourse) {
            if (selectedCourse.includes(item.corso)) {
              res.push(item);
            }
          } else {
            res.push(item);
          }
        }
      });
      setResults(res);
    });

    await setTimeout(() => {
      setLoading(false);
    });
  }

  const initDropdown = () => {
    let items = [];
    [...carico_didattico.corsi, ...carico_didattico.extra_courses].forEach(
      course => {
        items.push({label: course.nome, value: course.codice + course.nome});
      },
    );
    setItems(items);
  };

  return (
    <ScreenContainer>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name="arrow-back" color={colors.black} size={32} />
        </Pressable>
        <TextInput
          autoFocus={true}
          ref={inputRef}
          placeholder={t('search')}
          placeholderTextColor={colors.mediumGray}
          style={{
            fontFamily: 'Montserrat-Bold',
            ...styles.textExtraLarge,
            ...styles.withHorizontalPadding,
            width: '100%',
            color: colors.black,
          }}
          onChangeText={txt => {
            setQuery(txt.toLowerCase().trim());
          }}
          onSubmitEditing={() => {
            setLoading(true);
            searchMaterial();
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Icon
            name="filter-list"
            size={24}
            style={{marginRight: 8}}
            color={colors.black}
          />
          <TextSubTitle text={t('byCourse')} />
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <DropdownSelector
            items={items}
            placeholder={{label: t('selectCourseDropdown'), value: null}}
            onValueChange={value => {
              setLoading(true);
              setSelectedCourse(value ? value : null);
            }}
          />
        </View>
      </View>

      <View style={{marginTop: 16}}></View>
      {results != null && (
        <TextSubTitle text={t('searchResults', {count: results.length})} />
      )}
      <View
        style={{
          flexDirection: 'column',
          flex: 1,
        }}>
        {results && (
          <FlatList
            data={results}
            renderItem={({item}) => {
              return (
                <View key={item.code}>
                  <DirectoryItem
                    tipo="file"
                    nome={item.nome}
                    filename={item.filename}
                    data_inserimento={item.data_inserimento}
                    size_kb={item.size_kb}
                    code={item.code}
                    corso={item.corso}
                  />
                </View>
              );
            }}
            ListEmptyComponent={
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 16,
                }}>
                <Icon name="search-off" color={colors.gray} size={64} />
                <TextS
                  text={t('noResults')}
                  weight="bold"
                  color={colors.gray}
                />
              </View>
            }
            ListHeaderComponent={
              loading && (
                <ActivityIndicator size="large" color={colors.gradient1} />
              )
            }
            ListFooterComponent={<View style={{marginBottom: 16}}></View>}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
