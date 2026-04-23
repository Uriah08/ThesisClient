import { useTranslation } from 'react-i18next'

export const useLessonContent = () => {
  const { t } = useTranslation()

  const lesson1Content = [
    { title: t('lesson1_1_title'), text: t('lesson1_1_text'), image: require('@/assets/images/modules/pre-drying/1.jpg') },
    { title: t('lesson1_2_title'), text: t('lesson1_2_text'), image: require('@/assets/images/modules/pre-drying/Screenshot_2025-12-02-19-38-08-55_b783bf344239542886fee7b48fa4b892.jpg') },
    { title: t('lesson1_3_title'), text: t('lesson1_3_text'), image: require('@/assets/images/modules/pre-drying/Messenger_creation_A5C66C14-70E1-4698-B59C-F6B5F9142D10.jpeg') },
    { title: t('lesson1_4_title'), text: t('lesson1_4_text'), image: require('@/assets/images/modules/pre-drying/IMG_20251202_222138.jpg') },
    { title: t('lesson1_5_title'), text: t('lesson1_5_text'), image: require('@/assets/images/modules/pre-drying/Messenger_creation_D4ACBFD1-B936-4B12-AB60-8D6EF406A06F.jpeg') },
  ]

  const lesson2Content = [
    { title: t('lesson2_1_title'), text: t('lesson2_1_text'), image: require('@/assets/images/modules/drying/IMG_20251203_154957.jpg') },
    { title: t('lesson2_2_title'), text: t('lesson2_2_text'), image: require('@/assets/images/modules/drying/Screenshot_2025-12-03-15-55-45-35_f9ee0578fe1cc94de7482bd41accb329.jpg') },
    { title: t('lesson2_3_title'), text: t('lesson2_3_text'), image: require('@/assets/images/modules/drying/FB_IMG_1764678929171.jpg') },
    { title: t('lesson2_4_title'), text: t('lesson2_4_text'), image: require('@/assets/images/modules/drying/FB_IMG_1764678831159.jpg') },
    { title: t('lesson2_5_title'), text: t('lesson2_5_text'), image: require('@/assets/images/modules/drying/IMG_20251202_222553.jpg') },
    { title: t('lesson2_6_title'), text: t('lesson2_6_text'), image: require('@/assets/images/modules/drying/IMG_20251203_155017.jpg') },
  ]

  const lesson3Content = [
    { title: t('lesson3_1_title'), text: t('lesson3_1_text'), image: require('@/assets/images/modules/post-drying/FB_IMG_1764678812228.jpg') },
    { title: t('lesson3_2_title'), text: t('lesson3_2_text'), image: require('@/assets/images/modules/post-drying/FB_IMG_1764681001195.jpg') },
    { title: t('lesson3_3_title'), text: t('lesson3_3_text'), image: require('@/assets/images/modules/post-drying/FB_IMG_1764678825851.jpg') },
    { title: t('lesson3_4_title'), text: t('lesson3_4_text'), image: require('@/assets/images/modules/post-drying/FB_IMG_1764678873582.jpg') },
    { title: t('lesson3_5_title'), text: t('lesson3_5_text'), image: require('@/assets/images/modules/post-drying/FB_IMG_1764681609611.jpg') },
    { title: t('lesson3_6_title'), text: t('lesson3_6_text'), image: require('@/assets/images/modules/post-drying/received_1267115995158703.jpeg') },
    { title: t('lesson3_7_title'), text: t('lesson3_7_text'), image: require('@/assets/images/modules/post-drying/FB_IMG_1764681613505.jpg') },
  ]

  return { lesson1Content, lesson2Content, lesson3Content }
}