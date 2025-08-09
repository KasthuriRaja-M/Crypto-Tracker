import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Market from './pages/Market';
import Favorites from './pages/Favorites';
import AssetDetail from './pages/AssetDetail';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Market />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/asset/:id" element={<AssetDetail />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
