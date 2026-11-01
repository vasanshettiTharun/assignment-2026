import { useCallback, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { COLORS } from '../constants'
import { getMyEnquiries } from '../storage'

export default function MyEnquiriesScreen() {
  const [enquiries, setEnquiries] = useState([])

  useFocusEffect(
    useCallback(() => {
      getMyEnquiries().then(setEnquiries)
    }, [])
  )

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.list}
      data={enquiries}
      keyExtractor={(item) => item._id}
      ListEmptyComponent={
        <Text style={styles.empty}>Enquiries you send from this phone will show here.</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.products}>{item.productsSelected.join(', ')}</Text>
          <Text style={styles.detail}>{item.occasion}</Text>
          <Text style={styles.detail}>{item.units} units, {item.budget} per unit</Text>
          <Text style={styles.detail}>Delivery by {item.deliveryDate.slice(0, 10)}</Text>
          <Text style={styles.date}>Sent on {item.createdAt.slice(0, 10)}</Text>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16 },
  empty: { marginTop: 40, textAlign: 'center', color: COLORS.muted, fontSize: 15 },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  products: { color: COLORS.text, fontSize: 16, fontWeight: '600', marginBottom: 6 },
  detail: { color: COLORS.muted, fontSize: 14, marginTop: 2 },
  date: { color: COLORS.brand, fontSize: 13, marginTop: 8 },
})
