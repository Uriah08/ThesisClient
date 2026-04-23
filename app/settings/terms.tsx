import { View, Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { ChevronLeft, FileTextIcon } from 'lucide-react-native'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'

const Terms = () => {
  const { t } = useTranslation()

  const sections = [
    { title: t('terms_1_title'),  body: t('terms_1_body') },
    { title: t('terms_2_title'),  body: t('terms_2_body') },
    { title: t('terms_3_title'),  body: t('terms_3_body') },
    { title: t('terms_4_title'),  body: t('terms_4_body') },
    { title: t('terms_5_title'),  body: t('terms_5_body') },
    { title: t('terms_6_title'),  body: t('terms_6_body') },
    { title: t('terms_7_title'),  body: t('terms_7_body') },
    { title: t('terms_8_title'),  body: t('terms_8_body') },
    { title: t('terms_9_title'),  body: t('terms_9_body') },
    { title: t('terms_10_title'), body: t('terms_10_body') },
    { title: t('terms_11_title'), body: t('terms_11_body') },
  ]
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 12,
        paddingTop: 56, paddingHorizontal: 24, paddingBottom: 8,
      }}>
        <Pressable
          onPress={() => router.push('/settings')}
          style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: '#f4f4f5',
            alignItems: 'center', justifyContent: 'center',
          }}>
          <ChevronLeft size={18} color="#18181b" />
        </Pressable>
        <Text style={{ fontSize: 17, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>
          {t('terms_title')}
        </Text>
      </View>

      {/* Last updated */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 24, paddingVertical: 12,
      }}>
        <View style={{
          width: 28, height: 28, borderRadius: 8,
          backgroundColor: '#EEEDFE',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <FileTextIcon size={13} color="#534AB7" />
        </View>
        <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
          {t('terms_last_updated')}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60, gap: 0 }}>

        {/* Summary card */}
        <View style={{
          padding: 14, backgroundColor: '#fafafa',
          borderRadius: 12, borderWidth: 0.5, borderColor: '#f4f4f5',
          marginBottom: 16,
        }}>
          <Text style={{
            fontSize: 11, fontFamily: 'PoppinsMedium',
            color: '#a1a1aa', letterSpacing: 0.8,
            textTransform: 'uppercase', marginBottom: 6,
          }}>
            {t('terms_summary_label')}
          </Text>
          <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#52525b', lineHeight: 20 }}>
            {t('terms_summary_body')}
          </Text>
        </View>

        {/* Sections */}
        {sections.map((section, i) => (
          <View key={i} style={{
            paddingVertical: 14,
            borderBottomWidth: i < sections.length - 1 ? 0.5 : 0,
            borderBottomColor: '#f4f4f5',
          }}>
            <Text style={{
              fontSize: 13, fontFamily: 'PoppinsMedium',
              color: '#18181b', marginBottom: 5,
            }}>
              {section.title}
            </Text>
            <Text style={{
              fontSize: 12, fontFamily: 'PoppinsRegular',
              color: '#71717a', lineHeight: 20,
            }}>
              {section.body}
            </Text>
          </View>
        ))}

      </ScrollView>
    </View>
  )
}

export default Terms