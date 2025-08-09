import { useEffect, useState } from 'react';
import { fetchAssets } from '../api';
import type { Asset } from '../types';
import AssetRow from '../components/AssetRow';
import { useLocalFavorites } from '../hooks/useLocalFavorites';

export default function Favorites() {
  const { favorites, toggleFavorite, isFavorite } = useLocalFavorites();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const list = await fetchAssets(200);
    const map = new Map(list.map((a) => [a.id, a] as const));
    setAssets(favorites.map((id) => map.get(id)).filter(Boolean) as Asset[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 20_000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites.join('|')]);

  if (favorites.length === 0) {
    return <div className="container"><p>No favorites yet. Go to Market and star some assets.</p></div>;
  }

  return (
    <div className="container">
      <h2>Favorites</h2>
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
              {assets.map((a) => (
                <AssetRow key={a.id} asset={a} isFavorite={isFavorite(a.id)} onToggleFavorite={toggleFavorite} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


