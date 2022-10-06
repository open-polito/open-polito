import React, {useContext, useEffect, useMemo, useState} from 'react';
import {FlatList, View} from 'react-native';
import colors from '../colors';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import DirectoryItem from '../ui/DirectoryItem';
import {AppDispatch, RootState} from '../store/store';
import {CourseState} from '../store/coursesSlice';
import {DropdownItem, ExtendedFile} from '../types';
import {MaterialItem} from 'open-polito-api/material';
import Screen from '../ui/Screen';
import {p} from '../scaling';
import PressableBase from '../ui/core/PressableBase';
import TablerIcon from '../ui/core/TablerIcon';
import TextInput from '../ui/core/TextInput';
import {DeviceContext} from '../context/Device';
import Tabs from '../ui/Tabs';
import Text from '../ui/core/Text';
import BadgeContainer from '../ui/core/BadgeContainer';
import {ModalContext} from '../context/ModalProvider';
import ListSelectorModal from '../components/modals/ListSelectorModal';

// TODO more searchable categories
const tabs = ['files'];

export default function Search({navigation}) {
  const {t} = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const {dark} = useContext(DeviceContext);
  const {setModal} = useContext(ModalContext);

  const courses = useSelector<RootState, CourseState[]>(
    state => state.courses.courses,
  );

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExtendedFile[]>([]);

  const [searchFilter, setSearchFilter] = useState('');

  const [quickLoad, setQuickLoad] = useState(true);

  // Timer controlling when to search again
  const [searchTimer, setSearchTimer] = useState<any>(null);

  // Timer controlling when to show full list
  const [loadTimer, setLoadTimer] = useState<any>(null);

  const items = useMemo<DropdownItem[]>(() => {
    return [
      {
        label: t('allCourses'),
        value: '',
      },
      ...courses.map(c => ({
        label: c.basicInfo.name,
        value: c.basicInfo.code + c.basicInfo.name,
      })),
    ];
  }, [courses]);

  useEffect(() => {
    handleNewSearch(query);
  }, [searchFilter, query]);

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
   * @param _query Search string
   * @param _items Array of files or dirs
   * @param course_name
   * @param course_code
   * @returns files
   */
  const findFiles = (
    _query: string,
    _items: MaterialItem[],
    course_name: string,
    course_code: string,
  ): ExtendedFile[] => {
    let _results: ExtendedFile[] = [];
    _items.forEach(item => {
      if (item.type == 'file') {
        if ((item.name + item.filename).toLowerCase().includes(_query)) {
          _results.push({...item, course_code, course_name});
        }
      } else if (item.type == 'dir') {
        _results.push(
          ...findFiles(_query, item.children, course_name, course_code),
        );
      }
    });
    return _results;
  };

  /**
   * Searches files matching specific query and course, and updates state.
   */
  const searchMaterial = (_query: string): void => {
    // Using setTimeout is a bit hacky, but it works.
    (async () => {
      setTimeout(() => {
        let res: ExtendedFile[] = [];
        if (_query === '') {
          setResults([]);
          return;
        }

        if (searchFilter) {
          const _course = courses.find(
            course =>
              searchFilter ===
              `${course.basicInfo.code}${course.basicInfo.name}`,
          );
          if (!_course) {
            res = [];
            return;
          }
          res.push(
            ...findFiles(
              _query,
              _course.extendedInfo?.material || [],
              _course.basicInfo.name,
              _course.basicInfo.code,
            ),
          );
        } else {
          courses.forEach(course => {
            res.push(
              ...findFiles(
                _query,
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
        <PressableBase
          onPress={() => {
            setModal(
              <ListSelectorModal
                items={items}
                title={t('selectCourseDropdown')}
                onSelect={value => setSearchFilter(value)}
              />,
            );
          }}
          style={{marginLeft: 16 * p}}>
          <BadgeContainer number={searchFilter === '' ? 0 : ''}>
            <TablerIcon
              name="adjustments"
              color={dark ? colors.gray200 : colors.gray700}
              size={24 * p}
            />
          </BadgeContainer>
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
        contentContainerStyle={{flexGrow: 1}}
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
