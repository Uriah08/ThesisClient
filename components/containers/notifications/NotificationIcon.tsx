import { Image, ImageSourcePropType } from 'react-native';
import React from 'react'

type Props = {
  iconCode?: string;
  size?: number
};

const getIconSource = (iconCode: string): ImageSourcePropType => {
  switch (iconCode) {
    case 'check':
      return require('@/assets/images/notification-icons/check.png');
    case 'weather':
      return require('@/assets/images/notification-icons/weather.png');
    case 'announcement':
      return require('@/assets/images/notification-icons/announcement.png');
    default:
      return require('@/assets/images/notification-icons/people.png');
  }
};

const NotificationIcon = ({ iconCode, size }: Props) => {
    const source = getIconSource(iconCode ?? '');
    return <Image source={source} style={{ width: size || 45, height: size || 45}} resizeMode='contain'/>;
}

export default NotificationIcon