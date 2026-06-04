import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminNewsList from './pages/admin/AdminNewsList'
import AdminNewsForm from './pages/admin/AdminNewsForm'
import AdminPendingAlerts from './pages/admin/AdminPendingAlerts'
import AdminSettings from './pages/admin/AdminSettings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminNewsList />} />
        <Route path="news" element={<AdminNewsList />} />
        <Route path="pending" element={<AdminPendingAlerts />} />
        <Route path="new" element={<AdminNewsForm mode="create" />} />
        <Route path="edit/:id" element={<AdminNewsForm mode="edit" />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default App
