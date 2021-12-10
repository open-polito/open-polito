import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
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
export default function MaterialSearch({navigation}) {
  const {t} = useTranslation();
  const [query, setQuery] = useState(null);
  const [materialList, setMaterialList] = useState([]);
  const [results, setResults] = useState([]);
  const carico_didattico = JSON.parse(
    useSelector(state => state.user.carico_didattico),
  );
  const material = useSelector(state => state.material.material);

  useEffect(() => {
    setMaterialList(getMaterialList(carico_didattico, material));
  }, []);

  function searchMaterial() {
    let res = [];
    materialList.forEach(item => {
      if ((item.nome + item.filename).toLowerCase().includes(query)) {
        res.push(item);
      }
    });
    setResults(res);
  }

  return (
    <SafeAreaView style={{height: '100%'}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View
        style={{
          ...styles.container,
          ...styles.safePaddingTop,
          ...styles.withHorizontalPadding,
          backgroundColor: colors.white,
        }}>
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
            placeholder={t('search')}
            style={{
              fontFamily: 'Montserrat-Bold',
              ...styles.textExtraLarge,
              ...styles.withHorizontalPadding,
              width: '100%',
            }}
            onChangeText={txt => {
              setQuery(txt.toLowerCase());
            }}
            onSubmitEditing={searchMaterial}
          />
        </View>
        <ScrollView
          style={{
            flexDirection: 'column',
          }}>
          {results.map(item => {
            return (
              <View key={item.code}>
                <DirectoryItem
                  tipo="file"
                  key={item.code}
                  nome={item.nome}
                  data_inserimento={item.data_inserimento}
                  size_kb={item.size_kb}
                  code={item.code}
                />
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
