import { useEffect, useMemo, useState } from 'react';
import { fetchAssets } from '../api';
import type { Asset } from '../types';
import AssetRow from '../components/AssetRow';
import { useLocalFavorites } from '../hooks/useLocalFavorites';

export default function Market() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { favorites, toggleFavorite, isFavorite } = useLocalFavorites();

  async function load() {
    try {
      setError(null);
      setLoading(true);
      const list = await fetchAssets(100, search || undefined);
      setAssets(list);
    } catch (e) {
      setError('Failed to load assets');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 15_000); // refresh every 15s
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filtered = useMemo(() => {
    if (!search) return assets;
    const q = search.toLowerCase();
    return assets.filter((a) => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q));
  }, [assets, search]);

  return (
    <div className="container">
      <div className="toolbar">
        <input
          className="search"
          placeholder="Search by name or symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="summary">Favorites: {favorites.length}</div>
      </div>

      {error && <div className="error">{error}</div>}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>24h</th>
                <th>Market Cap</th>
                <th>Volume (24h)</th>
                <th>Supply</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <AssetRow key={a.id} asset={a} isFavorite={isFavorite(a.id)} onToggleFavorite={toggleFavorite} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


