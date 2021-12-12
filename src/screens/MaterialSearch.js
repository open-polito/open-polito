import React, {useEffect, useRef, useState} from 'react';
import {Pressable, ScrollView, TextInput, View} from 'react-native';
import colors from '../colors';
import styles from '../styles';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {getMaterialList} from '../utils/material';
import DirectoryItem from '../components/DirectoryItem';
import {TextS, TextSubTitle} from '../components/Text';
import ScreenContainer from '../components/ScreenContainer';
export default function MaterialSearch({navigation}) {
  const {t} = useTranslation();
  const [query, setQuery] = useState(null);
  const [materialList, setMaterialList] = useState([]);
  const [results, setResults] = useState(null);
  const carico_didattico = JSON.parse(
    useSelector(state => state.user.carico_didattico),
  );
  const material = useSelector(state => state.material.material);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    setMaterialList(getMaterialList(carico_didattico, material));
  }, []);

  function searchMaterial() {
    let res = [];
    if (query == '') {
      return;
    }
    materialList.forEach(item => {
      if ((item.nome + item.filename).toLowerCase().includes(query)) {
        res.push(item);
      }
    });
    setResults(res);
  }

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
          onSubmitEditing={searchMaterial}
        />
      </View>
      {results != null && (
        <TextSubTitle text={t('searchResults', {count: results.length})} />
      )}
      <View
        style={{
          flexDirection: 'column',
        }}>
        {results != null &&
          (results.length > 0 ? (
            <ScrollView>
              {results.map(item => {
                return (
                  <View key={item.code}>
                    <DirectoryItem
                      tipo="file"
                      key={item.code}
                      nome={item.nome}
                      filename={item.filename}
                      data_inserimento={item.data_inserimento}
                      size_kb={item.size_kb}
                      code={item.code}
                      corso={item.corso}
                    />
                  </View>
                );
              })}
              <View style={{marginBottom: 120}}></View>
            </ScrollView>
          ) : (
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                marginTop: -styles.textExtraLarge.fontSize,
              }}>
              <Icon name="search-off" color={colors.gray} size={64} />
              <TextS text={t('noResults')} weight="bold" color={colors.gray} />
            </View>
          ))}
      </View>
    </ScreenContainer>
  );
}
