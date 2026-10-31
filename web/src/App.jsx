import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Catalogue from './pages/Catalogue.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Enquiry from './pages/Enquiry.jsx'
import ThankYou from './pages/ThankYou.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import Admin from './pages/Admin.jsx'

export default function App() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Catalogue />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Catalogue />} />
        </Routes>
      </main>
    </>
  )
}
