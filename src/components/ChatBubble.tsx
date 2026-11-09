
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import type { LocationCoords, Message } from '../types/message';
import { formatMessageTime } from '../utils/dateUtils';

export interface ChatBubbleProps {
  message: Message;
  isMine: boolean;
  dateHeader?: string | null;
  onOpenLocation?: (coords: LocationCoords) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isMine,
  dateHeader,
  onOpenLocation,
}) => {
  const isLocation = message.type === 'location' && !!message.location;
  const coords = message.location;

  return (
    <View>
      {dateHeader ? (
        <View style={styles.datePillWrapper}>
          <View style={styles.datePill}>
            <Text style={styles.datePillText}>{dateHeader}</Text>
          </View>
        </View>
      ) : null}

      <View
        style={[
          styles.row,
          isMine ? styles.rowMine : styles.rowOther,
        ]}>
        <View
          style={[
            styles.bubble,
            isMine ? styles.bubbleMine : styles.bubbleOther,
          ]}>
          {isLocation && coords ? (
            <View style={styles.locationContainer}>
              <View style={styles.locationHeader}>
                <View
                  style={[
                    styles.mapIconCircle,
                    isMine ? styles.mapIconMine : styles.mapIconOther,
                  ]}>
                  <Ionicons
                    name="location"
                    size={20}
                    color={isMine ? colors.primary : colors.white}
                  />
                </View>
                <View style={styles.locationTextBox}>
                  <Text
                    style={[
                      styles.locationTitle,
                      isMine ? styles.textMine : styles.textOther,
                    ]}>
                    {message.text || 'Đã gửi vị trí'}
                  </Text>
                  <Text
                    style={[
                      styles.coordsText,
                      isMine ? styles.subTextMine : styles.subTextOther,
                    ]}>
                    {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.openMapButton,
                  isMine ? styles.openMapMine : styles.openMapOther,
                ]}
                onPress={() => onOpenLocation?.(coords)}
                activeOpacity={0.8}>
                <Ionicons
                  name="map-outline"
                  size={15}
                  color={isMine ? colors.primary : colors.white}
                />
                <Text
                  style={[
                    styles.openMapText,
                    isMine ? styles.openMapTextMine : styles.openMapTextOther,
                  ]}>
                  Mở trong Google Maps
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text
              style={[
                styles.messageText,
                isMine ? styles.textMine : styles.textOther,
              ]}>
              {message.text}
            </Text>
          )}

          <Text
            style={[
              styles.timeText,
              isMine ? styles.timeMine : styles.timeOther,
            ]}>
            {formatMessageTime(message.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  datePillWrapper: {
    alignItems: 'center',
    marginVertical: 10,
  },
  datePill: {
    backgroundColor: '#E5EAF3',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  datePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  rowMine: {
    justifyContent: 'flex-end',
  },
  rowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMine: {
    backgroundColor: colors.bubbleMine,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.bubbleOther,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  textMine: {
    color: colors.bubbleMineText,
  },
  textOther: {
    color: colors.bubbleOtherText,
  },
  subTextMine: {
    color: 'rgba(255,255,255,0.85)',
  },
  subTextOther: {
    color: colors.textMuted,
  },
  timeText: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeMine: {
    color: 'rgba(255,255,255,0.78)',
  },
  timeOther: {
    color: colors.textMuted,
  },
  locationContainer: {
    minWidth: 210,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  mapIconMine: {
    backgroundColor: colors.white,
  },
  mapIconOther: {
    backgroundColor: colors.primary,
  },
  locationTextBox: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  coordsText: {
    fontSize: 12,
    marginTop: 2,
  },
  openMapButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  openMapMine: {
    backgroundColor: colors.white,
  },
  openMapOther: {
    backgroundColor: colors.primary,
  },
  openMapText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  openMapTextMine: {
    color: colors.primary,
  },
  openMapTextOther: {
    color: colors.white,
  },
});

export default ChatBubble;

