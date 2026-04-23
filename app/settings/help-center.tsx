import {
  View, Text, ScrollView, Image, Pressable,
} from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import {
  ChevronLeft, CircleCheck, CircleX,
  PanelLeftDashed, Play, Scan, Smartphone,
  CloudSunIcon,
} from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

// ─── section header ────────────────────────────────────────────────────────────
type SectionHeaderProps = {
  icon: any
  label: string
  iconBg: string
  iconColor: string
}
const SectionHeader = ({ icon: Icon, label, iconBg, iconColor }: SectionHeaderProps) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 28, marginBottom: 12 }}>
    <View style={{
      width: 30, height: 30, borderRadius: 8,
      backgroundColor: iconBg,
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon size={14} color={iconColor} />
    </View>
    <Text style={{ fontSize: 13, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>
      {label}
    </Text>
  </View>
)

// ─── sub-heading ───────────────────────────────────────────────────────────────
const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <Text style={{
    fontSize: 13, fontFamily: 'PoppinsMedium',
    color: '#18181b', marginTop: 14, marginBottom: 4,
  }}>
    {children}
  </Text>
)

// ─── body text ─────────────────────────────────────────────────────────────────
const Body = ({ children }: { children: React.ReactNode }) => (
  <Text style={{
    fontSize: 12, fontFamily: 'PoppinsRegular',
    color: '#71717a', lineHeight: 20, marginTop: 2,
  }}>
    {children}
  </Text>
)

// ─── divider ───────────────────────────────────────────────────────────────────
const Divider = () => (
  <View style={{ height: 0.5, backgroundColor: '#f4f4f5', marginTop: 24 }} />
)

// ─── weather row ───────────────────────────────────────────────────────────────
type WeatherRowProps = {
  src: any
  label: string
  description: string
}
const WeatherRow = ({ src, label, description }: WeatherRowProps) => (
  <View style={{
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: '#f4f4f5',
  }}>
    <Image source={src} style={{ width: 28, height: 28 }} resizeMode="contain" />
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 12, fontFamily: 'PoppinsMedium', color: '#18181b', marginBottom: 2 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#71717a', lineHeight: 18 }}>
        {description}
      </Text>
    </View>
  </View>
)

const HelpCenter = () => {
  const { t } = useTranslation()

  const weatherIcons = [
    { src: require('@/assets/images/weather-icons/1.png'), label: t('help_weather_clear_label'),     desc: t('help_weather_clear_desc') },
    { src: require('@/assets/images/weather-icons/2.png'), label: t('help_weather_few_label'),       desc: t('help_weather_few_desc') },
    { src: require('@/assets/images/weather-icons/3.png'), label: t('help_weather_scattered_label'), desc: t('help_weather_scattered_desc') },
    { src: require('@/assets/images/weather-icons/4.png'), label: t('help_weather_broken_label'),    desc: t('help_weather_broken_desc') },
    { src: require('@/assets/images/weather-icons/6.png'), label: t('help_weather_shower_label'),    desc: t('help_weather_shower_desc') },
    { src: require('@/assets/images/weather-icons/5.png'), label: t('help_weather_rain_label'),      desc: t('help_weather_rain_desc') },
    { src: require('@/assets/images/weather-icons/7.png'), label: t('help_weather_thunder_label'),   desc: t('help_weather_thunder_desc') },
  ]

  const alertRows = [
    { rain: '0%',         cloud: 'Below 50%',  label: t('help_alert_excellent'), color: '#16a34a' },
    { rain: '0%',         cloud: '50% – 100%', label: t('help_alert_good'),      color: '#2563eb' },
    { rain: '1% – 80%',   cloud: 'Up to 100%', label: t('help_alert_caution'),   color: '#ca8a04' },
    { rain: '81% – 98%',  cloud: 'Any',        label: t('help_alert_warning'),   color: '#ea580c' },
    { rain: '99% – 100%', cloud: 'Any',        label: t('help_alert_danger'),    color: '#dc2626' },
  ]

  const roleCards = [
    {
      role: t('help_roles_admin_role'),
      subtitle: t('help_roles_admin_subtitle'),
      desc: t('help_roles_admin_desc'),
      bg: '#FAEEDA', color: '#854F0B',
    },
    {
      role: t('help_roles_member_role'),
      subtitle: t('help_roles_member_subtitle'),
      desc: t('help_roles_member_desc'),
      bg: '#E6F1FB', color: '#185FA5',
    },
  ]

  const classRows = [
    { status: t('help_scan_status_reject'),  desc: t('help_scan_status_reject_desc'),  color: '#961515' },
    { status: t('help_scan_status_undried'), desc: t('help_scan_status_undried_desc'), color: '#c47f00' },
    { status: t('help_scan_status_dry'),     desc: t('help_scan_status_dry_desc'),     color: '#127312' },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 12,
        paddingTop: 56, paddingHorizontal: 24, paddingBottom: 8,
      }}>
        <Pressable onPress={() => router.push('/settings')} style={{
          width: 36, height: 36, borderRadius: 18,
          backgroundColor: '#f4f4f5',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <ChevronLeft size={18} color="#18181b" />
        </Pressable>
        <Text style={{ fontSize: 17, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>
          {t('help_title')}
        </Text>
      </View>

      {/* summary chip row */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 24, paddingVertical: 12,
      }}>
        <View style={{
          width: 28, height: 28, borderRadius: 8,
          backgroundColor: '#E6F1FB',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <CloudSunIcon size={13} color="#185FA5" />
        </View>
        <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
          {t('help_subtitle')}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}>

        {/* summary card */}
        <View style={{
          padding: 14, backgroundColor: '#fafafa',
          borderRadius: 12, borderWidth: 0.5, borderColor: '#f4f4f5', marginBottom: 4,
        }}>
          <Text style={{
            fontSize: 11, fontFamily: 'PoppinsMedium', color: '#a1a1aa',
            letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6,
          }}>
            {t('help_overview_label')}
          </Text>
          <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#52525b', lineHeight: 20 }}>
            {t('help_overview_body')}
          </Text>
        </View>

        {/* ── Getting Started ── */}
        <SectionHeader icon={Play} label={t('help_gs_label')} iconBg="#E1F5EE" iconColor="#0F6E56" />
        <SubHeading>{t('help_gs_1_heading')}</SubHeading>
        <Body>{t('help_gs_1_body')}</Body>
        <SubHeading>{t('help_gs_2_heading')}</SubHeading>
        <Body>{t('help_gs_2_body')}</Body>
        <SubHeading>{t('help_gs_3_heading')}</SubHeading>
        <Body>{t('help_gs_3_body')}</Body>

        <Divider />

        {/* ── Navigating the App ── */}
        <SectionHeader icon={Smartphone} label={t('help_nav_label')} iconBg="#E6F1FB" iconColor="#185FA5" />
        <SubHeading>{t('help_nav_1_heading')}</SubHeading>
        <Body>{t('help_nav_1_body')}</Body>

        <Text style={{
          fontSize: 11, fontFamily: 'PoppinsMedium', color: '#a1a1aa',
          letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 14, marginBottom: 8,
        }}>
          {t('help_nav_weather_icons_label')}
        </Text>
        <Body>{t('help_nav_weather_icons_body')}</Body>

        <View style={{
          marginTop: 10, padding: 14, backgroundColor: '#fafafa',
          borderRadius: 12, borderWidth: 0.5, borderColor: '#f4f4f5',
        }}>
          {weatherIcons.map((w, i, arr) => (
            <View key={i} style={i < arr.length - 1 ? {} : { borderBottomWidth: 0 }}>
              <WeatherRow src={w.src} label={w.label} description={w.desc} />
            </View>
          ))}
        </View>

        <Text style={{
          fontSize: 11, fontFamily: 'PoppinsMedium', color: '#a1a1aa',
          letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 18, marginBottom: 4,
        }}>
          {t('help_alert_table_label')}
        </Text>
        <Body>{t('help_alert_table_body')}</Body>

        {/* Alert Table — inline with translated headers */}
        <View style={{
          borderRadius: 12, borderWidth: 0.5, borderColor: '#e4e4e7',
          overflow: 'hidden', marginTop: 12,
        }}>
          <View style={{
            flexDirection: 'row', backgroundColor: '#fafafa',
            borderBottomWidth: 0.5, borderBottomColor: '#e4e4e7',
          }}>
            {[t('help_alert_col_rain'), t('help_alert_col_cloud'), t('help_alert_col_alert')].map((h, i) => (
              <Text key={i} style={{
                flex: 1, padding: 10, fontSize: 11,
                fontFamily: 'PoppinsSemiBold', color: '#52525b',
              }}>{h}</Text>
            ))}
          </View>
          {alertRows.map((row, i) => (
            <View key={i} style={{
              flexDirection: 'row',
              borderTopWidth: i === 0 ? 0 : 0.5, borderTopColor: '#f4f4f5',
            }}>
              <Text style={{ flex: 1, padding: 10, fontSize: 11, fontFamily: 'PoppinsRegular', color: '#71717a' }}>{row.rain}</Text>
              <Text style={{ flex: 1, padding: 10, fontSize: 11, fontFamily: 'PoppinsRegular', color: '#71717a' }}>{row.cloud}</Text>
              <Text style={{ flex: 1, padding: 10, fontSize: 11, fontFamily: 'PoppinsSemiBold', color: row.color }}>{row.label}</Text>
            </View>
          ))}
        </View>

        <SubHeading>{t('help_nav_2_heading')}</SubHeading>
        <Body>{t('help_nav_2_body')}</Body>
        <SubHeading>{t('help_nav_3_heading')}</SubHeading>
        <Body>{t('help_nav_3_body')}</Body>
        <SubHeading>{t('help_nav_4_heading')}</SubHeading>
        <Body>{t('help_nav_4_body')}</Body>
        <SubHeading>{t('help_nav_5_heading')}</SubHeading>
        <Body>{t('help_nav_5_body')}</Body>

        <Divider />

        {/* ── Drying Area Roles ── */}
        <SectionHeader icon={PanelLeftDashed} label={t('help_roles_label')} iconBg="#FAEEDA" iconColor="#854F0B" />
        <Body>{t('help_roles_body')}</Body>

        {roleCards.map((r, i) => (
          <View key={i} style={{
            marginTop: 10, padding: 14, backgroundColor: '#fafafa',
            borderRadius: 12, borderWidth: 0.5, borderColor: '#f4f4f5', gap: 6,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ paddingHorizontal: 10, paddingVertical: 2, backgroundColor: r.bg, borderRadius: 20 }}>
                <Text style={{ fontSize: 11, fontFamily: 'PoppinsMedium', color: r.color }}>{r.role}</Text>
              </View>
              <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>{r.subtitle}</Text>
            </View>
            <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#71717a', lineHeight: 20 }}>{r.desc}</Text>
          </View>
        ))}

        <Divider />

        {/* ── Scan Methods ── */}
        <SectionHeader icon={Scan} label={t('help_scan_label')} iconBg="#EEEDFE" iconColor="#534AB7" />
        <Body>{t('help_scan_body_1')}</Body>
        <Body>{t('help_scan_body_2')}</Body>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
          {[
            { src: require('@/assets/images/help/good.jpg'),  icon: CircleCheck, color: '#16a34a', caption: t('help_scan_correct') },
            { src: require('@/assets/images/help/slant.jpg'), icon: CircleX,     color: '#dc2626', caption: t('help_scan_incorrect') },
          ].map((item, i) => (
            <View key={i} style={{
              flex: 1, alignItems: 'center', gap: 8, padding: 10,
              backgroundColor: '#fafafa', borderRadius: 14,
              borderWidth: 0.5, borderColor: '#f4f4f5',
            }}>
              <View style={{ borderRadius: 10, overflow: 'hidden', width: '100%', height: 160 }}>
                <Image source={item.src} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <item.icon size={14} color={item.color} />
                <Text style={{ fontSize: 11, fontFamily: 'PoppinsMedium', color: item.color }}>{item.caption}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 10 }}>
          <Body>{t('help_scan_lawlaw_note')}</Body>
        </View>

        <Text style={{
          fontSize: 11, fontFamily: 'PoppinsMedium', color: '#a1a1aa',
          letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 18, marginBottom: 4,
        }}>
          {t('help_scan_class_label')}
        </Text>
        <Body>{t('help_scan_class_body')}</Body>

        {/* Classification Table — inline with translated headers */}
        <View style={{
          borderRadius: 12, borderWidth: 0.5, borderColor: '#e4e4e7',
          overflow: 'hidden', marginTop: 12,
        }}>
          <View style={{
            flexDirection: 'row', backgroundColor: '#fafafa',
            borderBottomWidth: 0.5, borderBottomColor: '#e4e4e7',
          }}>
            {[t('help_scan_class_col_status'), t('help_scan_class_col_desc')].map((h, i) => (
              <Text key={i} style={{
                padding: 10, fontSize: 11,
                fontFamily: 'PoppinsSemiBold', color: '#52525b',
                width: i === 0 ? '38%' : '62%',
              }}>{h}</Text>
            ))}
          </View>
          {classRows.map((row, i) => (
            <View key={i} style={{
              flexDirection: 'row',
              borderTopWidth: i === 0 ? 0 : 0.5, borderTopColor: '#f4f4f5',
            }}>
              <Text style={{ padding: 10, fontSize: 11, width: '38%', fontFamily: 'PoppinsSemiBold', color: row.color }}>{row.status}</Text>
              <Text style={{ padding: 10, fontSize: 11, width: '62%', fontFamily: 'PoppinsRegular', color: '#71717a', lineHeight: 18 }}>{row.desc}</Text>
            </View>
          ))}
        </View>

        <Divider />

        {/* ── Need more help ── */}
        <View style={{
          marginTop: 20, padding: 14, backgroundColor: '#fafafa',
          borderRadius: 12, borderWidth: 0.5, borderColor: '#f4f4f5', gap: 6,
        }}>
          <Text style={{
            fontSize: 11, fontFamily: 'PoppinsMedium', color: '#a1a1aa',
            letterSpacing: 0.8, textTransform: 'uppercase',
          }}>
            {t('help_more_label')}
          </Text>
          <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#52525b', lineHeight: 20 }}>
            {t('help_more_body')}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

export default HelpCenter