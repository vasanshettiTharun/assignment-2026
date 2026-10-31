import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY = 'my-enquiries'

export async function getMyEnquiries() {
  const saved = await AsyncStorage.getItem(KEY)
  return saved ? JSON.parse(saved) : []
}

// Newest enquiry goes first
export async function saveMyEnquiry(enquiry) {
  const enquiries = await getMyEnquiries()
  await AsyncStorage.setItem(KEY, JSON.stringify([enquiry, ...enquiries]))
}
