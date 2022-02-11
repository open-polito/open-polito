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
import DirectoryItem from '../components/DirectoryItem';
import {TextS, TextSubTitle} from '../components/Text';
import ScreenContainer from '../components/ScreenContainer';
import DropdownSelector from '../components/DropdownSelector';
import {RootState} from '../store/store';
import {CourseState} from '../store/coursesSlice';
import {Cartella, File} from 'open-polito-api/corso';
import {DropdownItem} from '../types';

export default function MaterialSearch({navigation}) {
  const {t} = useTranslation();

  const courses = useSelector<RootState, CourseState[]>(
    state => state.courses.courses,
  );

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<File[]>([]);

  const inputRef = useRef(null);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [items, setItems] = useState<DropdownItem[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    inputRef.current.focus();
    initDropdown();
  }, []);

  useEffect(() => {
    searchMaterial();
  }, [selectedCourse]);

  const initDropdown = () => {
    let items: {label: string; value: string}[] = [];
    courses.forEach(course => {
      items.push({label: course.name, value: course.code + course.name});
    });
    setItems(items);
  };

  /**
   * Recursively finds files that match query, given directory.
   *
   * @param dir The directory to search
   */
  const findFiles = (dir: Cartella) => {
    let results: File[] = [];
    dir.file.forEach(item => {
      if (item.tipo == 'file') {
        if ((item.nome + item.filename).toLowerCase().includes(query)) {
          results.push(item);
        }
      } else if (item.tipo == 'cartella') {
        results.push(...findFiles(item));
      }
    });
    return results;
  };

  /**
   * Searches files matching specific query and course, and updates state.
   */
  const searchMaterial = () => {
    // Using setTimeout is a bit hacky, but it works.
    (async () => {
      setTimeout(() => {
        setLoading(true);
      }, 0);

      setTimeout(() => {
        let res: File[] = [];
        if (query == '') {
          setLoading(false);
          return;
        }

        let rootDir: Cartella = {
          tipo: 'cartella',
          code: '',
          nome: '',
          file: [],
        };

        if (selectedCourse) {
          rootDir.file =
            courses.find(course => selectedCourse == course.code + course.name)
              ?.material || [];
        } else {
          courses.forEach(course => {
            course.material && rootDir.file.push(...course.material);
          });
        }

        res = findFiles(rootDir).sort(
          (a, b) => b.data_inserimento.getTime() - a.data_inserimento.getTime(),
        );

        setResults(res);
      }, 0);
      setTimeout(() => {
        setLoading(false);
      }, 0);
    })();
  };

  return (
    <ScreenContainer style={{...styles.withHorizontalPadding}}>
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
