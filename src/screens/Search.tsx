import React, {useContext, useEffect, useRef, useState} from 'react';
import {FlatList, Pressable, View} from 'react-native';
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
import Screen from '../ui/Screen';
import {p} from '../scaling';
import PressableBase from '../ui/core/PressableBase';
import TablerIcon from '../ui/core/TablerIcon';
import TextInput from '../ui/core/TextInput';
import {DeviceContext} from '../context/Device';
import Tabs from '../ui/Tabs';

// TODO more searchable categories
// TODO course names for each file

const tabs = ['files'];

export default function Search({navigation}) {
  const {t} = useTranslation();
  const {dark} = useContext(DeviceContext);

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
    // inputRef.current.focus();
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
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12 * p,
          paddingVertical: 16 * p,
        }}>
        <PressableBase
          onPress={navigation.goBack}
          style={{marginRight: 16 * p}}>
          <TablerIcon
            name="arrow-left"
            color={dark ? colors.gray200 : colors.gray700}
            size={24 * p}
          />
        </PressableBase>
        <TextInput
          initiallyFocused
          icon="search"
          dark={dark}
          placeholder={t('searchForAnything')}
          autoFocus={true}
          onChangeText={txt => {
            const _query = txt.toLowerCase().trim();
            setQuery(_query);
            handleNewSearch(_query);
          }}
          style={{flex: 1}}
        />
        <PressableBase onPress={() => {}} style={{marginLeft: 16 * p}}>
          <TablerIcon
            name="adjustments"
            color={dark ? colors.gray200 : colors.gray700}
            size={24 * p}
          />
        </PressableBase>
      </View>
      <Tabs
        dark={dark}
        items={[{label: t('files'), value: 'files'}]}
        onChange={() => {}}
        adjusted
      />
      <FlatList
        style={{paddingTop: 24 * p, paddingHorizontal: 16 * p}}
        data={quickLoad ? results.slice(0, 10) : results}
        keyExtractor={item => item.code}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        renderItem={({item}) => {
          return (
            <View key={item.code}>
              <DirectoryItem item={item} key={item.code} dark={dark} />
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
            <TextS text={t('noResults')} weight="bold" color={colors.gray} />
          </View>
        }
        ListFooterComponent={<View style={{marginBottom: 24 * p}}></View>}
      />
    </Screen>
  );
}
