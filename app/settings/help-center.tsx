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

// ─── highlight span ────────────────────────────────────────────────────────────
const Hi = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ color: '#155183', fontFamily: 'PoppinsMedium' }}>
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

// ─── alert table ───────────────────────────────────────────────────────────────
type AlertRow = { rain: string; cloud: string; label: string; color: string }
const alertRows: AlertRow[] = [
  { rain: '0%',         cloud: 'Below 50%',   label: 'Excellent', color: '#16a34a' },
  { rain: '0%',         cloud: '50% – 100%',  label: 'Good',      color: '#2563eb' },
  { rain: '1% – 80%',   cloud: 'Up to 100%',  label: 'Caution',   color: '#ca8a04' },
  { rain: '81% – 98%',  cloud: 'Any',         label: 'Warning',   color: '#ea580c' },
  { rain: '99% – 100%', cloud: 'Any',         label: 'Danger',    color: '#dc2626' },
]

const AlertTable = () => (
  <View style={{
    borderRadius: 12, borderWidth: 0.5, borderColor: '#e4e4e7',
    overflow: 'hidden', marginTop: 12,
  }}>
    {/* header */}
    <View style={{
      flexDirection: 'row', backgroundColor: '#fafafa',
      borderBottomWidth: 0.5, borderBottomColor: '#e4e4e7',
    }}>
      {['Rain %', 'Cloud %', 'Alert'].map((h, i) => (
        <Text key={i} style={{
          flex: 1, padding: 10, fontSize: 11,
          fontFamily: 'PoppinsSemiBold', color: '#52525b',
        }}>
          {h}
        </Text>
      ))}
    </View>
    {/* rows */}
    {alertRows.map((row, i) => (
      <View key={i} style={{
        flexDirection: 'row',
        borderTopWidth: i === 0 ? 0 : 0.5, borderTopColor: '#f4f4f5',
      }}>
        <Text style={{ flex: 1, padding: 10, fontSize: 11, fontFamily: 'PoppinsRegular', color: '#71717a' }}>
          {row.rain}
        </Text>
        <Text style={{ flex: 1, padding: 10, fontSize: 11, fontFamily: 'PoppinsRegular', color: '#71717a' }}>
          {row.cloud}
        </Text>
        <Text style={{ flex: 1, padding: 10, fontSize: 11, fontFamily: 'PoppinsSemiBold', color: row.color }}>
          {row.label}
        </Text>
      </View>
    ))}
  </View>
)

// ─── classification table ──────────────────────────────────────────────────────
type ClassRow = { status: string; desc: string; color: string }
const classRows: ClassRow[] = [
  { status: 'Reject',  desc: 'Not suitable due to spoilage or defects.',   color: '#961515' },
  { status: 'Undried', desc: 'Still moist and needs more drying time.',     color: '#c47f00' },
  { status: 'Dry',     desc: 'Fully dried and ready for storage or sale.',  color: '#127312' },
]

const ClassTable = () => (
  <View style={{
    borderRadius: 12, borderWidth: 0.5, borderColor: '#e4e4e7',
    overflow: 'hidden', marginTop: 12,
  }}>
    <View style={{
      flexDirection: 'row', backgroundColor: '#fafafa',
      borderBottomWidth: 0.5, borderBottomColor: '#e4e4e7',
    }}>
      {['Status', 'Description'].map((h, i) => (
        <Text key={i} style={{
          padding: 10, fontSize: 11,
          fontFamily: 'PoppinsSemiBold', color: '#52525b',
          width: i === 0 ? '38%' : '62%',
        }}>
          {h}
        </Text>
      ))}
    </View>
    {classRows.map((row, i) => (
      <View key={i} style={{
        flexDirection: 'row',
        borderTopWidth: i === 0 ? 0 : 0.5, borderTopColor: '#f4f4f5',
      }}>
        <Text style={{
          padding: 10, fontSize: 11, width: '38%',
          fontFamily: 'PoppinsSemiBold', color: row.color,
        }}>
          {row.status}
        </Text>
        <Text style={{
          padding: 10, fontSize: 11, width: '62%',
          fontFamily: 'PoppinsRegular', color: '#71717a', lineHeight: 18,
        }}>
          {row.desc}
        </Text>
      </View>
    ))}
  </View>
)

// ─── main screen ───────────────────────────────────────────────────────────────
const HelpCenter = () => {
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
          Help Center
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
          FiScan — User guide & reference
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
      >

        {/* summary card */}
        <View style={{
          padding: 14, backgroundColor: '#fafafa',
          borderRadius: 12, borderWidth: 0.5, borderColor: '#f4f4f5',
          marginBottom: 4,
        }}>
          <Text style={{
            fontSize: 11, fontFamily: 'PoppinsMedium',
            color: '#a1a1aa', letterSpacing: 0.8,
            textTransform: 'uppercase', marginBottom: 6,
          }}>
            Overview
          </Text>
          <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#52525b', lineHeight: 20 }}>
            This guide walks you through account setup, app navigation, drying area roles, and the image scan feature
            for quality assessment of sun-dried fish.
          </Text>
        </View>

        {/* ── Getting Started ─────────────────────────────────────── */}
        <SectionHeader
          icon={Play}
          label="Getting Started"
          iconBg="#E1F5EE"
          iconColor="#0F6E56"
        />

        <SubHeading>1. Create an account</SubHeading>
        <Body>
          Open the app and tap <Hi>Register</Hi>. Enter your username, email, and create a password,
          then follow the complete profile steps. A success message will appear once registration is complete.
        </Body>

        <SubHeading>2. Log in to your account</SubHeading>
        <Body>
          Tap <Hi>Log In</Hi>, enter your registered email and password, then press <Hi>Login</Hi>.
          You&apos;ll see a confirmation message when login is successful before being redirected to complete your profile.
        </Body>

        <SubHeading>3. Complete your profile</SubHeading>
        <Body>
          After your first login, you&apos;ll be directed to the <Hi>Complete Profile</Hi> page.
          Fill in all required information including your full name, birthdate, mobile number, and other farmer details.
          Once completed, you&apos;ll be redirected to the dashboard.
        </Body>

        <Divider />

        {/* ── Navigating the App ──────────────────────────────────── */}
        <SectionHeader
          icon={Smartphone}
          label="Navigating the App"
          iconBg="#E6F1FB"
          iconColor="#185FA5"
        />

        <SubHeading>1. Dashboard</SubHeading>
        <Body>
          Your main hub displays a personalized welcome message, today&apos;s weather forecast, and drying recommendations.
          View weather charts and receive warnings about <Hi>whether conditions</Hi> are suitable for sun-drying your tuyo.
        </Body>

        {/* weather icons */}
        <Text style={{
          fontSize: 11, fontFamily: 'PoppinsMedium', color: '#a1a1aa',
          letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 14, marginBottom: 8,
        }}>
          Weather Icons Guide
        </Text>
        <Body>
          The app uses weather icons to help you quickly assess current conditions and determine whether sun-drying is safe.
        </Body>

        <View style={{
          marginTop: 10, padding: 14, backgroundColor: '#fafafa',
          borderRadius: 12, borderWidth: 0.5, borderColor: '#f4f4f5',
        }}>
          {[
            { src: require('@/assets/images/weather-icons/1.png'), label: 'Clear Sky',        desc: 'Ideal drying conditions with strong sunlight.' },
            { src: require('@/assets/images/weather-icons/2.png'), label: 'Few Clouds',       desc: 'Mostly sunny. Drying is still recommended.' },
            { src: require('@/assets/images/weather-icons/3.png'), label: 'Scattered Clouds', desc: 'Partial coverage. Drying may take longer.' },
            { src: require('@/assets/images/weather-icons/4.png'), label: 'Broken Clouds',    desc: 'Limited sunlight. Drying efficiency reduced.' },
            { src: require('@/assets/images/weather-icons/6.png'), label: 'Shower Rain',      desc: 'Light rain. Sun-drying not recommended.' },
            { src: require('@/assets/images/weather-icons/5.png'), label: 'Rain',             desc: 'Continuous rainfall. Drying is unsafe.' },
            { src: require('@/assets/images/weather-icons/7.png'), label: 'Thunderstorm',     desc: 'Severe weather. Drying should be avoided.' },
          ].map((w, i, arr) => (
            <View key={i} style={i < arr.length - 1 ? {} : { borderBottomWidth: 0 }}>
              <WeatherRow src={w.src} label={w.label} description={w.desc} />
            </View>
          ))}
        </View>

        {/* alert table */}
        <Text style={{
          fontSize: 11, fontFamily: 'PoppinsMedium', color: '#a1a1aa',
          letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 18, marginBottom: 4,
        }}>
          Weather Alerts for Drying Fish
        </Text>
        <Body>
          Alerts are calculated from rain probability and cloud coverage to indicate the risk of outdoor drying.
        </Body>
        <AlertTable />

        <SubHeading>2. Drying</SubHeading>
        <Body>
          Monitor and track your <Hi>sun-dried fish drying process</Hi>. View ongoing batches and drying progress.
          Create your own drying area to start a batch, or join existing areas to collaborate with other users.
          The module provides step-by-step guidance and <Hi>real-time progress tracking</Hi>.
        </Body>

        <SubHeading>3. Scan</SubHeading>
        <Body>
          Capture images of your tuyo to analyze quality and get instant assessment results.
          Choose between your <Hi>phone camera</Hi> or gallery, then tap <Hi>Scan</Hi> to begin analysis.
          Results detect whether the tuyo is <Hi>undried, dry, or rejected</Hi>.
        </Body>

        <SubHeading>4. Notifications</SubHeading>
        <Body>
          Stay updated with alerts and reminders about your drying batches.
          The app sends <Hi>weather notifications</Hi> up to two days in advance, timed to your scheduled drying activities.
          You&apos;ll also receive <Hi>drying progress</Hi> updates and important <Hi>announcements</Hi>.
        </Body>

        <SubHeading>5. Settings</SubHeading>
        <Body>
          Manage your profile, change your password, and access the <Hi>FAQ</Hi>, <Hi>Help Center</Hi>,{' '}
          <Hi>Terms of Service</Hi>, and <Hi>About</Hi> pages. You can also securely <Hi>log out</Hi> from here.
        </Body>

        <Divider />

        {/* ── Drying Area Roles ───────────────────────────────────── */}
        <SectionHeader
          icon={PanelLeftDashed}
          label="Drying Area Roles & Permissions"
          iconBg="#FAEEDA"
          iconColor="#854F0B"
        />

        <Body>
          After joining or creating a drying area, users are assigned roles that determine what actions they can perform.
        </Body>

        {/* role cards */}
        {[
          {
            role: 'Admin',
            subtitle: 'Drying Area Owner',
            desc: 'Users who create a drying area automatically become the admin with full control. Admins can edit area info, create and delete trays, manage drying timelines, harvest batches, and delete the entire drying area.',
            bg: '#FAEEDA', color: '#854F0B',
          },
          {
            role: 'Member',
            subtitle: 'Limited Access',
            desc: 'Members can only use trays created by the admin. They can create drying timelines, monitor progress, and harvest their assigned batches. This ensures organized workflows and smooth collaboration.',
            bg: '#E6F1FB', color: '#185FA5',
          },
        ].map((r, i) => (
          <View key={i} style={{
            marginTop: 10,
            padding: 14, backgroundColor: '#fafafa',
            borderRadius: 12, borderWidth: 0.5, borderColor: '#f4f4f5',
            gap: 6,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{
                paddingHorizontal: 10, paddingVertical: 2,
                backgroundColor: r.bg, borderRadius: 20,
              }}>
                <Text style={{ fontSize: 11, fontFamily: 'PoppinsMedium', color: r.color }}>
                  {r.role}
                </Text>
              </View>
              <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
                {r.subtitle}
              </Text>
            </View>
            <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#71717a', lineHeight: 20 }}>
              {r.desc}
            </Text>
          </View>
        ))}

        <Divider />

        {/* ── Scan Methods ────────────────────────────────────────── */}
        <SectionHeader
          icon={Scan}
          label="Scan Methods & Guidelines"
          iconBg="#EEEDFE"
          iconColor="#534AB7"
        />

        <Body>
          The Scan feature analyzes dried fish quality using image recognition. Access it from the{' '}
          <Hi>main hub</Hi> or from inside a tray. After taking or selecting a photo, tap <Hi>Scan</Hi> to begin.
        </Body>

        <Body>
          For accurate results, lay the fish <Hi>flat</Hi> (not tilted), with the camera no more than{' '}
          <Hi>30 cm</Hi> away to properly capture texture details.
        </Body>

        {/* good / bad images */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
          {[
            { src: require('@/assets/images/help/good.jpg'),  icon: CircleCheck, color: '#16a34a', caption: 'Correct' },
            { src: require('@/assets/images/help/slant.jpg'), icon: CircleX,     color: '#dc2626', caption: 'Incorrect' },
          ].map((item, i) => (
            <View key={i} style={{
              flex: 1, alignItems: 'center', gap: 8,
              padding: 10, backgroundColor: '#fafafa',
              borderRadius: 14, borderWidth: 0.5, borderColor: '#f4f4f5',
            }}>
              <View style={{ borderRadius: 10, overflow: 'hidden', width: '100%', height: 160 }}>
                <Image source={item.src} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <item.icon size={14} color={item.color} />
                <Text style={{ fontSize: 11, fontFamily: 'PoppinsMedium', color: item.color }}>
                  {item.caption}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 10 }}>
          <Body>
            This feature is designed specifically for <Hi>lawlaw fish</Hi>. Scanning other fish types may produce inaccurate results.
          </Body>
        </View>

        {/* classification table */}
        <Text style={{
          fontSize: 11, fontFamily: 'PoppinsMedium', color: '#a1a1aa',
          letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 18, marginBottom: 4,
        }}>
          Classification Results
        </Text>
        <Body>
          Each scan result is color-coded for quick identification of dryness level and quality.
        </Body>
        <ClassTable />

        <Divider />

        {/* ── Need more help ──────────────────────────────────────── */}
        <View style={{
          marginTop: 20, padding: 14, backgroundColor: '#fafafa',
          borderRadius: 12, borderWidth: 0.5, borderColor: '#f4f4f5',
          gap: 6,
        }}>
          <Text style={{
            fontSize: 11, fontFamily: 'PoppinsMedium', color: '#a1a1aa',
            letterSpacing: 0.8, textTransform: 'uppercase',
          }}>
            Need more help?
          </Text>
          <Text style={{ fontSize: 12, fontFamily: 'PoppinsRegular', color: '#52525b', lineHeight: 20 }}>
            Explore the FAQ, review the Terms of Service, or visit the About section for more information.
            For issues not covered here, contact the developer through the <Hi>About</Hi> section.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

export default HelpCenter