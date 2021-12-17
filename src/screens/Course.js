import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import colors from '../colors';
import ArrowHeader from '../components/ArrowHeader';
import ScreenContainer from '../components/ScreenContainer';
import {TextL, TextN, TextS, TextXL} from '../components/Text';
import {UserContext} from '../context/User';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles';

export default function Course({navigation, route}) {
  const {t} = useTranslation();
  const {dispatch} = useDispatch();
  const {user} = useContext(UserContext);
  const [courseData, setCourseData] = useState(null);
  const code = route.params.courseCode;

  useEffect(() => {
    if (!user.carico_didattico) {
      user.populate();
    }
    (async () => {
      user.carico_didattico.corsi.forEach(corso => {
        if (corso.codice == code) {
          const _course = corso;
          _course.populate().then(() => {
            setCourseData(_course);
          });
        }
      });
    })();
  }, []);

  return (
    <ScreenContainer>
      <ArrowHeader backFunc={navigation.goBack} />

      {courseData && (
        <View>
          <View>
            <TextXL
              text={courseData.nome}
              numberOfLines={2}
              weight="medium"
              color={colors.black}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TextL text={code} color={colors.mediumGray} />
              <View style={{flexDirection: 'column'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    borderWidth: 1,
                  }}>
                  <Icon name="person-outline" color={colors.gray} size={16} />
                  <TextS
                    text={courseData.cognome_prof + ' ' + courseData.nome_prof}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}
