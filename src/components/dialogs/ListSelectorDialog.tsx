import React, {useContext, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../colors';
import {DeviceContext} from '../../context/Device';
import {p} from '../../scaling';
import {CoursesState} from '../../store/coursesSlice';
import {
  SessionState,
  setDialog,
  setSearchFilter,
} from '../../store/sessionSlice';
import {AppDispatch, RootState} from '../../store/store';
import {ListSelectorDialogParams} from '../../types';
import Text from '../../ui/core/Text';

const ListSelectorDialog = ({...params}: ListSelectorDialogParams) => {
  const dispatch = useDispatch<AppDispatch>();
  const {t} = useTranslation();
  const {dark} = useContext(DeviceContext);

  const {searchFilter} = useSelector<RootState, SessionState>(
    state => state.session,
  );
  const coursesState = useSelector<RootState, CoursesState>(
    state => state.courses,
  );

  /**
   * Title of the list selector changes based on the selector type
   */
  const title = useMemo(() => {
    switch (params.selectorType) {
      case 'SEARCH_FILTER':
        return t('selectCourseDropdown');
      default:
        return t('selectItem');
    }
  }, [params.selectorType]);

  const items = useMemo<{label: string; value: string}[]>(() => {
    switch (params.selectorType) {
      case 'SEARCH_FILTER':
        switch (searchFilter.type) {
          case 'COURSE':
            return coursesState.courses.map(course => ({
              label: `${course.basicInfo.code} - ${course.basicInfo.name}`,
              value: `${course.basicInfo.code}${course.basicInfo.name}`,
            }));
          default:
            return [];
        }
      default:
        return [];
    }
  }, [params, searchFilter, coursesState]);

  /**
   * Action executed when item selected. Changes based on selector type,
   * but always performs an action onto the redux state, where the set
   * element can be retrieved.
   */
  const onSelect = (value: string) => {
    switch (params.selectorType) {
      case 'SEARCH_FILTER':
        switch (searchFilter.type) {
          case 'COURSE':
            dispatch(setSearchFilter({...searchFilter, selected: value}));
            break;
          default:
            dispatch(setSearchFilter({type: '', selected: ''}));
            break;
        }
    }
  };

  return (
    <View style={{paddingHorizontal: 16 * p}}>
      <View style={{marginBottom: 16 * p}}>
        <Text s={16 * p} w="m" c={dark ? colors.gray100 : colors.gray800}>
          {title}
        </Text>
      </View>
      {[{label: t('allCourses'), value: ''}, ...items].map(item => (
        <Pressable
          key={item.value}
          onPress={() => {
            onSelect(item.value);
            dispatch(
              setDialog({
                visible: false,
                params: null,
              }),
            );
          }}>
          <View
            style={{
              paddingVertical: 8 * p,
            }}>
            <Text s={12 * p} w="r" c={dark ? colors.gray100 : colors.gray800}>
              {item.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default ListSelectorDialog;
