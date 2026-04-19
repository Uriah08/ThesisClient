import { View, Text, Pressable, ScrollView, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { ChevronLeft, StoreIcon, MapPin, Phone, Trash2, Plus, Pencil } from 'lucide-react-native'
import { router, useLocalSearchParams } from 'expo-router'
import AddRetail from '@/components/containers/dialogs/AddRetail'
import { useGetRetailsQuery } from '@/store/retailsApi'
import DeleteClass from '@/components/containers/dialogs/Delete'
import EditRetail from '@/components/containers/dialogs/EditRetail'
import SkeletonShimmer from '@/components/containers/SkeletonPlaceholder'

const PRIMARY = '#155183'

const RetailPage = () => {
  const { id } = useLocalSearchParams()
  const [visible, setVisible] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined)
  const { data: retails, isLoading, refetch } = useGetRetailsQuery(Number(id))
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setTimeout(() => setRefreshing(false), 1000)
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 12,
        paddingTop: 56, paddingHorizontal: 24, paddingBottom: 8,
      }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: '#f4f4f5',
            alignItems: 'center', justifyContent: 'center',
          }}>
          <ChevronLeft size={18} color="#18181b" />
        </Pressable>
        <Text style={{ fontSize: 17, fontFamily: 'PoppinsSemiBold', color: '#18181b' }}>
          Retail Shops
        </Text>
      </View>

      {/* Subtitle chip */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 24, paddingVertical: 12,
      }}>
        <View style={{
          width: 28, height: 28, borderRadius: 8,
          backgroundColor: '#E8F4FD',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <StoreIcon size={13} color="#155183" />
        </View>
        <Text style={{ fontSize: 11, fontFamily: 'PoppinsRegular', color: '#a1a1aa' }}>
          Stores where your harvest was sold
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, gap: 12 }}
        refreshControl={
          <RefreshControl colors={['#155183']} tintColor="#155183" refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <SkeletonShimmer key={i} height={110} borderRadius={16} />
            ))}
          </>
        ) : retails?.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 80, gap: 10 }}>
            <View style={{
              width: 52, height: 52, borderRadius: 16,
              backgroundColor: '#E8F4FD',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <StoreIcon size={22} color="#155183" />
            </View>
            <Text style={{
              fontSize: 14, fontFamily: 'PoppinsMedium',
              color: '#d4d4d8', marginTop: 4,
            }}>
              No retail shops yet
            </Text>
          </View>
        ) : (
          retails?.map((item, i) => (
            <View key={i} style={{
              borderRadius: 16, borderWidth: 0.5,
              borderColor: '#f4f4f5', backgroundColor: '#fafafa',
              padding: 16,
            }}>

              {/* Card header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <View style={{
                    width: 34, height: 34, borderRadius: 10,
                    backgroundColor: '#E8F4FD',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <StoreIcon size={15} color="#155183" />
                  </View>
                  <Text
                    style={{ flex: 1, fontSize: 14, fontFamily: 'PoppinsMedium', color: '#18181b' }}
                    numberOfLines={1}
                  >
                    {item.store_name}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Pressable
                    onPress={() => { setShowEdit(true); setSelectedId(item.id) }}
                    hitSlop={8}
                    style={{
                      width: 30, height: 30, borderRadius: 8,
                      backgroundColor: '#EBF2FC',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                    <Pencil size={13} color="#155183" />
                  </Pressable>

                  <Pressable
                    onPress={() => { setShowDelete(true); setSelectedId(item.id) }}
                    hitSlop={8}
                    style={{
                      width: 30, height: 30, borderRadius: 8,
                      backgroundColor: '#FCEBEB',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                    <Trash2 size={13} color="#A32D2D" />
                  </Pressable>
                </View>
              </View>

              {/* Divider */}
              <View style={{ height: 0.5, backgroundColor: '#f4f4f5', marginVertical: 12 }} />

              {/* Location & Contact */}
              <View style={{ gap: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MapPin size={12} color="#a1a1aa" />
                  <Text style={{ fontSize: 13, fontFamily: 'PoppinsRegular', color: '#52525b' }}>
                    {item.location}
                  </Text>
                </View>
                {item.contact ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Phone size={12} color="#a1a1aa" />
                    <Text style={{ fontSize: 13, fontFamily: 'PoppinsRegular', color: '#52525b' }}>
                      {item.contact}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {visible && (
        <AddRetail visible={visible} setVisible={setVisible} farmId={Number(id)} />
      )}

      {showDelete && (
        <DeleteClass
          visible={showDelete}
          setVisible={setShowDelete}
          type="retail"
          retailId={selectedId}
        />
      )}

      {showEdit && (
        <EditRetail
          visible={showEdit}
          setVisible={setShowEdit}
          retailId={selectedId}
          defaultStoreName={retails?.find((item) => item.id === selectedId)?.store_name}
          defaultLocation={retails?.find((item) => item.id === selectedId)?.location}
          defaultContact={retails?.find((item) => item.id === selectedId)?.contact}
        />
      )}

      {/* FAB */}
      <View style={{ position: 'absolute', bottom: 60, right: 20, zIndex: 999 }}>
        <Pressable
          onPress={() => setVisible(true)}
          android_ripple={{ color: '#ffffff30', borderless: false }}
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 8,
            backgroundColor: PRIMARY, paddingVertical: 12,
            paddingHorizontal: 20, borderRadius: 99,
            shadowColor: PRIMARY,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
          }}
        >
          <Plus size={16} color="#ffffff" />
          <Text style={{ color: '#fff', fontFamily: 'PoppinsSemiBold', fontSize: 13 }}>
            Add Retail
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export default RetailPage