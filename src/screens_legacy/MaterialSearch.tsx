import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Pressable, TextInput, View} from 'react-native';
import colors from '../colors';
import styles from '../styles';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import DirectoryItem from '../ui/DirectoryItem';
import {TextS, TextSubTitle} from '../components/Text';
import ScreenContainer from '../components/ScreenContainer';
import DropdownSelector from '../components/DropdownSelector';
import {RootState} from '../store/store';
import {CourseState} from '../store/coursesSlice';
import {DropdownItem} from '../types';
import {Directory, File} from 'open-polito-api/material';

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

  const [quickLoad, setQuickLoad] = useState(true);

  // Timer controlling when to search again
  const [searchTimer, setSearchTimer] = useState<any>(null);

  // Timer controlling when to show full list
  const [loadTimer, setLoadTimer] = useState<any>(null);

  useEffect(() => {
    inputRef.current.focus();
    initDropdown();
  }, []);

  useEffect(() => {
    handleNewSearch(query);
  }, [selectedCourse]);

  const initDropdown = () => {
    let items: {label: string; value: string}[] = [];
    courses.forEach(course => {
      items.push({
        label: course.basicInfo.name,
        value: course.basicInfo.code + course.basicInfo.name,
      });
    });
    setItems(items);
  };

  /**
   * Handles a new search
   * @param txt The query
   */
  const handleNewSearch = (txt: string) => {
    const _query = txt.toLowerCase().trim();
    if (searchTimer) {
      clearTimeout(searchTimer);
    }
    if (loadTimer) {
      clearTimeout(loadTimer);
    }
    setQuickLoad(true);
    setSearchTimer(
      setTimeout(() => {
        searchMaterial(_query);
        setLoadTimer(
          setTimeout(() => {
            setQuickLoad(false);
          }, 500),
        );
      }, 50),
    );
  };

  /**
   * Recursively finds files that match query, given directory.
   *
   * @param dir The directory to search
   */
  const findFiles = (query: string, dir: Directory) => {
    let results: File[] = [];
    dir.children.forEach(item => {
      if (item.type == 'file') {
        if ((item.name + item.filename).toLowerCase().includes(query)) {
          results.push(item);
        }
      } else if (item.type == 'dir') {
        results.push(...findFiles(query, item));
      }
    });
    return results;
  };

  /**
   * Searches files matching specific query and course, and updates state.
   */
  const searchMaterial = (query: string) => {
    // Using setTimeout is a bit hacky, but it works.
    (async () => {
      setTimeout(() => {
        let res: File[] = [];
        if (query == '') {
          setResults([]);
          return;
        }

        let rootDir: Directory = {
          type: 'dir',
          code: '',
          name: '',
          children: [],
        };

        if (selectedCourse) {
          rootDir.children =
            courses.find(
              course =>
                selectedCourse == course.basicInfo.code + course.basicInfo.name,
            )?.extendedInfo?.material || [];
        } else {
          courses.forEach(course => {
            course.extendedInfo?.material &&
              rootDir.children.push(...course.extendedInfo.material);
          });
        }

        res = findFiles(query, rootDir).sort(
          (a, b) => b.creation_date - a.creation_date,
        );

        setResults(res);
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
            ...styles.textBold,
            ...styles.textExtraLarge,
            ...styles.withHorizontalPadding,
            width: '100%',
            color: colors.black,
          }}
          onChangeText={txt => {
            const _query = txt.toLowerCase().trim();
            setQuery(_query);
            handleNewSearch(_query);
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
            data={quickLoad ? results.slice(0, 10) : results}
            keyExtractor={item => item.code}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            renderItem={({item}) => {
              return (
                <View key={item.code}>
                  <DirectoryItem item={item} />
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
            ListFooterComponent={<View style={{marginBottom: 16}}></View>}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
