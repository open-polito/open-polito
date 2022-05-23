import React, {useContext, useEffect, useRef, useState} from 'react';
import {FlatList, Pressable, View} from 'react-native';
import colors from '../colors';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import DirectoryItem from '../ui/DirectoryItem';
import {RootState} from '../store/store';
import {CourseState} from '../store/coursesSlice';
import {DropdownItem, ExtendedFile} from '../types';
import {Directory, File, MaterialItem} from 'open-polito-api/material';
import Screen from '../ui/Screen';
import {p} from '../scaling';
import PressableBase from '../ui/core/PressableBase';
import TablerIcon from '../ui/core/TablerIcon';
import TextInput from '../ui/core/TextInput';
import {DeviceContext} from '../context/Device';
import Tabs from '../ui/Tabs';
import Text from '../ui/core/Text';
import {color} from 'react-native-reanimated';

// TODO more searchable categories
// TODO filter

const tabs = ['files'];

export default function Search({navigation}) {
  const {t} = useTranslation();
  const {dark} = useContext(DeviceContext);

  const courses = useSelector<RootState, CourseState[]>(
    state => state.courses.courses,
  );

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExtendedFile[]>([]);

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
   * Recursively finds files that match query
   *
   * @param query Search string
   * @param items Array of files or dirs
   * @param course_name
   * @param course_code
   * @returns files
   */
  const findFiles = (
    query: string,
    items: MaterialItem[],
    course_name: string,
    course_code: string,
  ): ExtendedFile[] => {
    let results: ExtendedFile[] = [];
    items.forEach(item => {
      if (item.type == 'file') {
        if ((item.name + item.filename).toLowerCase().includes(query)) {
          results.push({...item, course_code, course_name});
        }
      } else if (item.type == 'dir') {
        results.push(
          ...findFiles(query, item.children, course_name, course_code),
        );
      }
    });
    return results;
  };

  /**
   * Searches files matching specific query and course, and updates state.
   */
  const searchMaterial = (query: string): void => {
    // Using setTimeout is a bit hacky, but it works.
    (async () => {
      setTimeout(() => {
        let res: ExtendedFile[] = [];
        if (query == '') {
          setResults([]);
          return;
        }

        if (selectedCourse) {
          // TODO when selected course filter
        } else {
          courses.forEach(course => {
            res.push(
              ...findFiles(
                query,
                course.extendedInfo?.material || [],
                course.basicInfo.name,
                course.basicInfo.code,
              ),
            );
          });
        }

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
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
        data={quickLoad ? results.slice(0, 10) : results}
        keyExtractor={item => item.code}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        renderItem={({item}) => {
          return (
            <View key={item.code}>
              <DirectoryItem
                item={item}
                key={item.code}
                dark={dark}
                course={item.course_name}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TablerIcon
              name="search-off"
              size={64 * p}
              color={dark ? colors.gray300 : colors.gray600}
            />
            <View
              style={{
                marginTop: 8 * p,
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Text
                s={12 * p}
                w="m"
                c={dark ? colors.gray200 : colors.gray700}
                style={{marginBottom: 8 * p}}>
                {t('noResults')}
              </Text>
              <Text s={10 * p} w="m" c={dark ? colors.gray300 : colors.gray600}>
                {t('tryADifferentTerm')}
              </Text>
            </View>
          </View>
        }
        ListFooterComponent={<View style={{marginBottom: 24 * p}}></View>}
      />
    </Screen>
  );
}
