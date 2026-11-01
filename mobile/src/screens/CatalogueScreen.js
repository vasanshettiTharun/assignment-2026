import { useEffect, useState } from 'react'
import {
  ActivityIndicator, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native'
import Chip from '../components/Chip'
import { API_URL } from '../config'
import { BUDGETS, CATEGORIES, COLORS, OCCASIONS } from '../constants'

function FilterRow({ options, value, onChange }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          selected={value === option}
          onPress={() => onChange(value === option ? '' : option)}
        />
      ))}
    </ScrollView>
  )
}

export default function CatalogueScreen({ navigation }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('')
  const [occasion, setOccasion] = useState('')
  const [budget, setBudget] = useState('')
  const [search, setSearch] = useState('')

  async function loadProducts() {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (occasion) params.append('occasion', occasion)
    if (budget) params.append('budget', budget)

    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/api/products?${params.toString()}`)
      if (!res.ok) throw new Error()
      setProducts(await res.json())
    } catch {
      setError('Could not load products.')
    }
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [category, occasion, budget])

  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  const filters = (
    <View style={styles.filters}>
      <TextInput
        placeholder="Search products"
        placeholderTextColor={COLORS.muted}
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />
      <FilterRow options={CATEGORIES} value={category} onChange={setCategory} />
      <FilterRow options={OCCASIONS} value={occasion} onChange={setOccasion} />
      <FilterRow options={BUDGETS} value={budget} onChange={setBudget} />
    </View>
  )

  function renderEmpty() {
    if (loading) return <ActivityIndicator size="large" color={COLORS.brand} style={styles.message} />
    if (error) {
      return (
        <View style={styles.message}>
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={loadProducts} style={styles.retry}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      )
    }
    return <Text style={[styles.message, styles.empty]}>No products match these filters.</Text>
  }

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.list}
      data={loading || error ? [] : visibleProducts}
      numColumns={2}
      columnWrapperStyle={styles.row}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={filters}
      ListEmptyComponent={renderEmpty}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => (
        <Pressable style={styles.card} onPress={() => navigation.navigate('ProductDetail', { slug: item.slug, name: item.name })}>
          <Image source={{ uri: API_URL + item.image }} style={styles.image} />
          <View style={styles.cardBody}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>
              ₹{item.priceMin.toLocaleString('en-IN')} to ₹{item.priceMax.toLocaleString('en-IN')}
            </Text>
          </View>
        </Pressable>
      )}
    />
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16 },
  filters: { marginBottom: 8 },
  search: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 12,
  },
  row: { gap: 12 },
  card: {
    flex: 1,
    maxWidth: '48.5%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: { width: '100%', aspectRatio: 1 },
  cardBody: { padding: 10 },
  category: { color: COLORS.brand, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  name: { color: COLORS.text, fontSize: 15, fontWeight: '600', marginTop: 2 },
  price: { color: COLORS.muted, fontSize: 13, marginTop: 4 },
  message: { marginTop: 40, alignItems: 'center' },
  empty: { textAlign: 'center', color: COLORS.muted },
  error: { color: COLORS.error, fontSize: 15 },
  retry: { marginTop: 12, backgroundColor: COLORS.brand, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 10 },
  retryText: { color: '#fff', fontWeight: '600' },
})
