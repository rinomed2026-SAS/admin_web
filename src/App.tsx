import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { isLoggedIn } from './auth';
import { Nav } from './components/Nav';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Sessions, Speakers, Sponsors, Hotels, Tourism } from './pages/CrudScreens';
import { EventInfo } from './pages/EventInfo';
import { Questions } from './pages/Questions';
import { Leads } from './pages/Leads';
import { Users } from './pages/Users';
import { Community } from './pages/Community';
import { NotFound } from './pages/NotFound';
import './App.css';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="layout">
      <Nav />
      <main className="content">{children}</main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/sessions"
          element={
            <ProtectedLayout>
              <Sessions />
            </ProtectedLayout>
          }
        />
        <Route
          path="/speakers"
          element={
            <ProtectedLayout>
              <Speakers />
            </ProtectedLayout>
          }
        />
        <Route
          path="/sponsors"
          element={
            <ProtectedLayout>
              <Sponsors />
            </ProtectedLayout>
          }
        />
        <Route
          path="/hotels"
          element={
            <ProtectedLayout>
              <Hotels />
            </ProtectedLayout>
          }
        />
        <Route
          path="/tourism"
          element={
            <ProtectedLayout>
              <Tourism />
            </ProtectedLayout>
          }
        />
        <Route
          path="/event-info"
          element={
            <ProtectedLayout>
              <EventInfo />
            </ProtectedLayout>
          }
        />
        <Route
          path="/questions"
          element={
            <ProtectedLayout>
              <Questions />
            </ProtectedLayout>
          }
        />
        <Route
          path="/leads"
          element={
            <ProtectedLayout>
              <Leads />
            </ProtectedLayout>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedLayout>
              <Users />
            </ProtectedLayout>
          }
        />
        <Route
          path="/community"
          element={
            <ProtectedLayout>
              <Community />
            </ProtectedLayout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
