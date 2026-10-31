import { useEffect, useState } from 'react'
import {
  Alert, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import Chip from '../components/Chip'
import { API_URL } from '../config'
import { BUDGETS, COLORS, CUSTOMISATIONS, OCCASIONS } from '../constants'
import { saveMyEnquiry } from '../storage'

// Gives the date as 2026-12-25, the same format the website sends
function toDateText(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export default function EnquiryScreen({ route, navigation }) {
  const productName = route.params?.productName

  const [products, setProducts] = useState([])
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    occasion: '',
    units: '',
    budget: '',
    deliveryDate: '',
    productsSelected: productName ? [productName] : [],
    customisation: [],
    message: '',
  })

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => setProducts(data))
      .catch(() => setFormError('Could not load the product list.'))
  }, [])

  function setField(field, value) {
    setForm({ ...form, [field]: value })
  }

  // Adds or removes a value from a list of choices
  function toggleItem(field, value) {
    const list = form[field]
    const newList = list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
    setForm({ ...form, [field]: newList })
  }

  function handleDateChange(event, date) {
    setShowDatePicker(false)
    if (event.type === 'set') setField('deliveryDate', toDateText(date))
  }

  async function handleSubmit() {
    setSubmitting(true)
    setErrors({})
    setFormError('')

    try {
      const res = await fetch(`${API_URL}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'app' }),
      })
      const data = await res.json()

      if (res.ok) {
        await saveMyEnquiry(data)
        Alert.alert('Thank you!', 'We have received your enquiry. Our sales team will contact you soon.')
        navigation.popToTop()
        navigation.navigate('MyEnquiriesTab')
      } else {
        setErrors(data.errors || {})
        setFormError(data.message)
      }
    } catch {
      setFormError('Could not send your enquiry. Please check your internet and try again.')
    }

    setSubmitting(false)
  }

  function renderInput(label, field, options = {}) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          value={form[field]}
          onChangeText={(value) => setField(field, value)}
          style={styles.input}
          placeholderTextColor={COLORS.muted}
          {...options}
        />
        {errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
      </View>
    )
  }

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={90} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {renderInput('Name', 'name')}
        {renderInput('Company', 'company')}
        {renderInput('Phone', 'phone', { keyboardType: 'phone-pad', maxLength: 10, placeholder: '10-digit mobile number' })}
        {renderInput('Email', 'email', { keyboardType: 'email-address', autoCapitalize: 'none' })}
        {renderInput('Number of units', 'units', { keyboardType: 'number-pad' })}

        <View style={styles.field}>
          <Text style={styles.label}>Occasion</Text>
          <View style={styles.choices}>
            {OCCASIONS.map((item) => (
              <Chip key={item} label={item} selected={form.occasion === item} onPress={() => setField('occasion', item)} />
            ))}
          </View>
          {errors.occasion && <Text style={styles.error}>{errors.occasion}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Budget per unit</Text>
          <View style={styles.choices}>
            {BUDGETS.map((item) => (
              <Chip key={item} label={item} selected={form.budget === item} onPress={() => setField('budget', item)} />
            ))}
          </View>
          {errors.budget && <Text style={styles.error}>{errors.budget}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Delivery date</Text>
          <Pressable style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text style={form.deliveryDate ? styles.dateText : styles.datePlaceholder}>
              {form.deliveryDate || 'Choose a date'}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker value={new Date()} mode="date" minimumDate={new Date()} onChange={handleDateChange} />
          )}
          {errors.deliveryDate && <Text style={styles.error}>{errors.deliveryDate}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Products</Text>
          <View style={styles.choices}>
            {products.map((product) => (
              <Chip
                key={product._id}
                label={product.name}
                selected={form.productsSelected.includes(product.name)}
                onPress={() => toggleItem('productsSelected', product.name)}
              />
            ))}
          </View>
          {errors.productsSelected && <Text style={styles.error}>{errors.productsSelected}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Customisation needed</Text>
          <View style={styles.choices}>
            {CUSTOMISATIONS.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={form.customisation.includes(item)}
                onPress={() => toggleItem('customisation', item)}
              />
            ))}
          </View>
        </View>

        {renderInput('Message (optional)', 'message', { multiline: true, style: [styles.input, styles.message] })}

        {formError !== '' && <Text style={styles.error}>{formError}</Text>}

        <Pressable style={[styles.button, submitting && styles.buttonDisabled]} onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.buttonText}>{submitting ? 'Sending...' : 'Send enquiry'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  field: { marginBottom: 16 },
  label: { color: COLORS.text, fontSize: 15, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  message: { height: 100, textAlignVertical: 'top' },
  choices: { flexDirection: 'row', flexWrap: 'wrap' },
  dateText: { color: COLORS.text, fontSize: 15 },
  datePlaceholder: { color: COLORS.muted, fontSize: 15 },
  error: { color: COLORS.error, fontSize: 13, marginTop: 4 },
  button: { backgroundColor: COLORS.brand, borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 8, marginBottom: 12 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
