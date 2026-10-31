import { Pressable, StyleSheet, Text } from 'react-native'
import { COLORS } from '../constants'

// A small button that can be switched on and off. Used for filters and form choices.
export default function Chip({ label, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.selected]}>
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selected: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  text: { color: COLORS.text, fontSize: 14 },
  selectedText: { color: '#fff', fontWeight: '600' },
})
