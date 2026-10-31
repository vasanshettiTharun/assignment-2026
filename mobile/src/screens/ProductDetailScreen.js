import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { API_URL } from '../config'
import { COLORS } from '../constants'

export default function ProductDetailScreen({ route, navigation }) {
  const { slug } = route.params
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => setProduct(data))
      .catch(() => setError('Could not load this product.'))
  }, [slug])

  if (error) return <Text style={styles.error}>{error}</Text>
  if (!product) return <ActivityIndicator size="large" color={COLORS.brand} style={styles.loading} />

  return (
    <ScrollView style={styles.screen}>
      <Image source={{ uri: API_URL + product.image }} style={styles.image} />

      <View style={styles.body}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>
          ₹{product.priceMin.toLocaleString('en-IN')} to ₹{product.priceMax.toLocaleString('en-IN')} per unit
        </Text>
        <Text style={styles.description}>{product.description}</Text>

        <Text style={styles.heading}>Suits these occasions</Text>
        <View style={styles.tags}>
          {product.occasions.map((item) => <Text key={item} style={styles.tag}>{item}</Text>)}
        </View>

        <Text style={styles.heading}>Customisation available</Text>
        <View style={styles.tags}>
          {product.customisation.map((item) => <Text key={item} style={styles.tag}>{item}</Text>)}
        </View>

        <Pressable style={styles.button} onPress={() => navigation.navigate('Enquiry', { productName: product.name })}>
          <Text style={styles.buttonText}>Enquire now</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  loading: { marginTop: 60 },
  error: { margin: 20, color: COLORS.error, fontSize: 15 },
  image: { width: '100%', aspectRatio: 1 },
  body: { padding: 16 },
  category: { color: COLORS.brand, fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  name: { color: COLORS.text, fontSize: 24, fontWeight: '700', marginTop: 4 },
  price: { color: COLORS.text, fontSize: 17, fontWeight: '600', marginTop: 6 },
  description: { color: COLORS.muted, fontSize: 15, lineHeight: 22, marginTop: 12 },
  heading: { color: COLORS.text, fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    backgroundColor: COLORS.brandLight,
    color: COLORS.text,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
  },
  button: { backgroundColor: COLORS.brand, borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 28, marginBottom: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
