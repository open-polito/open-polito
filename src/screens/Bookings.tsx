import i18next from 'i18next';
import moment from 'moment';
import {
  barcode_url,
  Booking,
  BookingContext,
  BookingSlot,
  BookingSubcontext,
} from 'open-polito-api/booking';
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../colors';
import {DeviceContext} from '../context/Device';
import {p} from '../scaling';
import {STATUS} from '../store/status';
import {AppDispatch, RootState} from '../store/store';
import {getBookingContexts, getMyBookings, UserState} from '../store/userSlice';
import PressableCard from '../ui/core/PressableCard';
import TablerIcon from '../ui/core/TablerIcon';
import Text from '../ui/core/Text';
import Header, {HEADER_TYPE} from '../ui/Header';
import NoContent from '../ui/NoContent';
import Screen from '../ui/Screen';
import Tabs from '../ui/Tabs';

// TODO add booking capabilities

const BookingSubctx = ({
  ctxId,
  subctx,
  language,
  dark,
}: {
  ctxId: string;
  subctx: BookingSubcontext;
  language: string;
  dark: boolean;
}) => {
  const {device} = useContext(DeviceContext);

  const [state, setState] = useState<{
    loaded: boolean;
    expanded: boolean;
    mounted: boolean;
    slots: BookingSlot[];
  }>({
    loaded: false,
    expanded: false,
    mounted: true,
    slots: [],
  });

  // TODO re-enable when booking feature added
  // useEffect(() => {
  //   const condition =
  //     state.mounted &&
  //     state.expanded &&
  //     !state.loaded &&
  //     state.slots.length === 0;
  //   if (!condition) {
  //     return;
  //   }
  //   (async () => {
  //     const slots = await getSlots(device, ctxId, subctx.id);
  //     state.mounted && setState(prev => ({...prev, loaded: true, slots}));
  //   })();
  // }, [state, device, ctxId, subctx]);

  useEffect(() => {
    return () => setState(prev => ({...prev, mounted: false}));
  }, []);

  return (
    <View key={subctx.id}>
      <Pressable
        onPress={() => setState(prev => ({...prev, expanded: !prev.expanded}))}
        android_ripple={{color: colors.lightGray}}
        style={{paddingVertical: 8 * p}}>
        <Text s={10 * p} w="m" c={dark ? colors.gray200 : colors.gray700}>
          {language === 'it' ? subctx.ita.name : subctx.eng.name}
        </Text>
      </Pressable>
      <View></View>
    </View>
  );
};

const BookingCtx = ({
  ctx,
  language,
  dark,
}: {
  ctx: BookingContext;
  language: string;
  dark: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
      <PressableCard
        expanded={expanded}
        dark={dark}
        onPress={() => {
          setExpanded(!expanded);
        }}
        description={
          language === 'it' ? ctx.ita.description : ctx.eng.description
        }
        title={language === 'it' ? ctx.ita.name : ctx.eng.name}
        expandedElement={
          ctx.subcontexts && ctx.subcontexts.length > 0 ? (
            <View style={{marginTop: 16 * p}}>
              {ctx.subcontexts?.map(subctx => (
                <BookingSubctx
                  dark={dark}
                  key={subctx.id}
                  subctx={subctx}
                  language={language}
                  ctxId={ctx.id}
                />
              ))}
            </View>
          ) : null
        }
      />
    </View>
  );
};

interface BookingCardProps {
  dark: boolean;
  booking: Booking;
  barcodeUrl: string;
}

const BookingCard: FC<BookingCardProps> = ({dark, booking, barcodeUrl}) => {
  const [expanded, setExpanded] = useState(false);

  const sections = useMemo(() => {
    return [
      {
        type: 'date',
        label: moment(booking.start_time).format('ll'),
        icon: 'calendar-time',
      },
      {
        type: 'time',
        label: `${moment(booking.start_time).format('LT')} - ${moment(
          booking.end_time,
        ).format('LT')}`,
        icon: 'clock',
      },
    ];
  }, [booking]);

  return (
    <PressableCard
      title={
        booking.course_id
          ? `${booking.course_name} - ${booking.course_id}`
          : booking.subcontext_name
      }
      description={booking.context_name}
      expanded={expanded}
      dark={dark}
      sideElement={
        !expanded && (
          <Image
            source={{uri: barcodeUrl}}
            style={{width: '100%', aspectRatio: 2.5, resizeMode: 'contain'}}
            resizeMode="contain"
          />
        )
      }
      expandedElement={
        <View style={{flex: 1, marginTop: 16 * p}}>
          <Image
            source={{uri: barcodeUrl}}
            style={{
              width: '100%',
              aspectRatio: 2.5,
              resizeMode: 'contain',
            }}
          />
        </View>
      }
      onPress={() => setExpanded(prev => !prev)}>
      <View style={{marginTop: 16 * p}}>
        {sections.map((section, i) => (
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
              },
              i > 0 && {marginTop: 8 * p},
            ]}>
            <TablerIcon
              name={section.icon}
              size={16 * p}
              color={dark ? colors.gray200 : colors.gray700}
              style={{marginRight: 8 * p}}
            />
            <Text
              style={{marginRight: 8 * p}}
              s={10 * p}
              w="r"
              c={dark ? colors.gray200 : colors.gray700}>
              {section.label}
            </Text>
          </View>
        ))}
      </View>
    </PressableCard>
  );
};

const Bookings = () => {
  const {t} = useTranslation();
  const {device, dark} = useContext(DeviceContext);
  const dispatch = useDispatch<AppDispatch>();

  const {
    userInfo,
    getBookingsStatus,
    getBookingContextsStatus,
    bookings,
    bookingContexts,
  } = useSelector<RootState, UserState>(state => state.user);

  const mounted = useRef(true);

  const tabs = useMemo(() => {
    return ['myBookings', 'newBooking'];
  }, []);

  const [state, setState] = useState<{
    currentTab: string;
    barcodeUrl: string;
  }>({
    currentTab: tabs[0],
    barcodeUrl: '',
  });

  // Refreshing
  const refreshing = useMemo(() => {
    return (
      getBookingsStatus.code === STATUS.PENDING ||
      getBookingContextsStatus.code === STATUS.PENDING
    );
  }, [getBookingsStatus, getBookingContextsStatus]);

  // Refresh
  const refresh = useCallback(
    (tab: 'myBookings' | 'newBooking') => {
      if (tab === 'myBookings') {
        dispatch(getMyBookings(device));
      }
      if (tab === 'newBooking') {
        dispatch(getBookingContexts(device));
      }
    },
    [device, dispatch],
  );

  // Load barcode
  useEffect(() => {
    if (state.barcodeUrl === '' && userInfo) {
      setState(prev => ({
        ...prev,
        barcodeUrl: barcode_url(userInfo.current_id),
      }));
    }
  }, [state.barcodeUrl, userInfo]);

  // On tab change
  useEffect(() => {
    (async () => {
      if (state.currentTab === tabs[0]) {
        dispatch(getMyBookings(device));
      } else if (state.currentTab === tabs[1]) {
        dispatch(getBookingContexts(device));
      }
    })();
  }, [state.currentTab, userInfo, device, dispatch, tabs]);

  // Cleanup
  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const _styles = useMemo(() => {
    return StyleSheet.create({
      container: {
        marginTop: 24 * p,
        paddingHorizontal: 16 * p,
        flex: 1,
      },
    });
  }, []);

  return (
    <Screen>
      <Header title={t('bookings')} headerType={HEADER_TYPE.MAIN} />
      <Tabs
        adjusted
        dark={dark}
        onChange={i =>
          setState(prev => ({
            ...prev,
            currentTab: tabs[i],
          }))
        }
        items={tabs.map(tab => ({label: t(tab), value: tab}))}
      />
      <View style={_styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() =>
                refresh(
                  state.currentTab === tabs[0] ? 'myBookings' : 'newBooking',
                )
              }
            />
          }>
          {(state.currentTab === tabs[0] &&
            getBookingsStatus.code === STATUS.PENDING) ||
          (state.currentTab === tabs[1] &&
            getBookingContextsStatus.code === STATUS.PENDING) ? (
            <ActivityIndicator />
          ) : state.currentTab === tabs[0] ? (
            bookings.length === 0 ? (
              <NoContent />
            ) : (
              bookings.map(booking => (
                <BookingCard
                  key={`${booking.context_id}${booking.subcontext_id}${booking.start_time}${booking.end_time}`}
                  dark={dark}
                  booking={booking}
                  barcodeUrl={state.barcodeUrl}
                />
              ))
            )
          ) : bookingContexts.length === 0 ? (
            <NoContent />
          ) : (
            bookingContexts.map(ctx => (
              <BookingCtx
                dark={dark}
                key={ctx.id}
                ctx={ctx}
                language={i18next.language}
              />
            ))
          )}
        </ScrollView>
      </View>
    </Screen>
  );
};

export default Bookings;
