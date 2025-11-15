/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Gauge, MapPlus, PanelsLeftRightIcon, Settings, Users } from "lucide-react-native";

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const modules = [
  {
    title: 'Module 1: Processing & Pre-Drying Preparation',
    image: require('@/assets/images/module-wallpaper1.png'),
    link: ''
  },
  {
    title: 'Module 2: Checking Drying Stage',
    image: require('@/assets/images/module-wallpaper2.png'),
    link: ''
  },
  {
    title: 'Module 3: Post-Drying & Storage',
    image: require('@/assets/images/module-wallpaper3.png'),
    link: ''
  },
]

export const farmMenu = [
  {
    title: "Home",
    icon: Gauge
  },
  {
    title: "Trays",
    icon: PanelsLeftRightIcon
  },
  {
    title: "Sessions",
    icon: MapPlus
  },
  {
    title: "Members",
    icon: Users
  },
  {
    title: "Settings",
    icon: Settings
  },
]

// export const apiUrl = '192.168.43.157' // MOBILE HOTSPOT
export const apiUrl = '192.168.1.26' // MY WIFI
