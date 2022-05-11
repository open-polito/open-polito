import {useNavigation} from '@react-navigation/native';
import i18next from 'i18next';
import {
  BookingContext,
  BookingSlot,
  BookingSubcontext,
  getContexts,
  getSlots,
} from 'open-polito-api/booking';
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import colors from '../colors';
import ArrowHeader from '../components/ArrowHeader';
import ScreenContainer from '../components/ScreenContainer';
import {TextM, TextN, TextS} from '../components/Text';
import {DeviceContext} from '../context/Device';
import styles from '../styles';

const BookingSubctx = ({
  ctxId,
  subctx,
  language,
}: {
  ctxId: string;
  subctx: BookingSubcontext;
  language: string;
}) => {
  const deviceContext = useContext(DeviceContext);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [slots, setSlots] = useState<BookingSlot[] | null>(null);

  useEffect(() => {
    if (!expanded) return;
    (async () => {
      setSlots(await getSlots(deviceContext.device, ctxId, subctx.id));
    })();
  }, [expanded]);

  return (
    <View key={subctx.id}>
      <Pressable
        onPress={() => {
          setExpanded(!expanded);
        }}
        android_ripple={{color: colors.lightGray}}
        style={{paddingVertical: 8}}>
        <TextS text={language == 'it' ? subctx.ita.name : subctx.eng.name} />
      </Pressable>
      {expanded &&
        slots &&
        slots.map(slot => (
          <View
            key={slot.slot_start}
            style={{backgroundColor: colors.lightGray}}>
            <TextS text={slot.seatsTaken} />
          </View>
        ))}
    </View>
  );
};

const BookingCtx = ({
  ctx,
  language,
}: {
  ctx: BookingContext;
  language: string;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      key={ctx.id}
      style={{
        ...styles.border,
        ...styles.elevatedSmooth,
        padding: 16,
        marginBottom: 16,
        backgroundColor: colors.white,
      }}>
      <Pressable
        android_ripple={{color: colors.lightGray}}
        onPress={() => {
          setExpanded(!expanded);
        }}>
        <TextN text={language == 'it' ? ctx.ita.name : ctx.eng.name} />
        <TextS
          text={language == 'it' ? ctx.ita.description : ctx.eng.description}
          color={colors.gray}
        />
      </Pressable>
      {expanded && ctx.subcontexts && ctx.subcontexts.length > 0 ? (
        <View style={{marginTop: 16}}>
          {ctx.subcontexts?.map(subctx => (
            <BookingSubctx subctx={subctx} language={language} ctxId={ctx.id} />
          ))}
        </View>
      ) : null}
    </View>
  );
};

const Bookings = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const deviceContext = useContext(DeviceContext);

  const [contexts, setContexts] = useState<BookingContext[]>([]);
  const [slots, setSlots] = useState<BookingSlot[]>([]);

  const language = useMemo(() => {
    return i18next.language;
  }, [i18next.language]);

  // Load stuff
  useEffect(() => {
    (async () => {
      const ctx = await getContexts(deviceContext.device);
      setContexts(ctx);
    })();
  }, []);

  return (
    <ScreenContainer>
      <View style={styles.withHorizontalPadding}>
        <ArrowHeader text={t('bookings')} backFunc={navigation.goBack} />
      </View>
      <View style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{
            ...styles.withHorizontalPadding,
            ...styles.paddingFromHeader,
            paddingBottom: 16,
          }}>
          {contexts.map(ctx => (
            <BookingCtx key={ctx.id} ctx={ctx} language={language} />
          ))}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
};

export default Bookings;
