import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAsset, fetchAssetHistory, formatCurrency } from '../api';
import type { Asset, Interval } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import dayjs from 'dayjs';

export default function AssetDetail() {
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [interval, setInterval] = useState<Interval>('d1');
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!id) return;
    setLoading(true);
    const [a, h] = await Promise.all([fetchAsset(id), fetchAssetHistory(id, interval)]);
    setAsset(a);
    setHistory(
      h.map((p) => ({
        time: p.time,
        price: Number(p.priceUsd),
        label: dayjs(p.time).format(interval === 'd1' ? 'MMM D' : 'HH:mm'),
      }))
    );
    setLoading(false);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 30_000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, interval]);

  const title = useMemo(() => (asset ? `${asset.name} (${asset.symbol})` : 'Loading...'), [asset]);

  return (
    <div className="container">
      <div className="detail-head">
        <h2>{title}</h2>
        <div className="info">
          <span>Price: <strong>{asset ? formatCurrency(asset.priceUsd, 6) : '-'}</strong></span>
          <span>Market Cap: <strong>{asset ? formatCurrency(asset.marketCapUsd) : '-'}</strong></span>
          <span>24h Volume: <strong>{asset ? formatCurrency(asset.volumeUsd24Hr) : '-'}</strong></span>
        </div>
        <div className="intervals">
          {(['m15','h1','d1'] as Interval[]).map((i) => (
            <button key={i} className={i === interval ? 'active' : ''} onClick={() => setInterval(i)}>{i}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={history} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" interval="preserveStartEnd" minTickGap={20} />
              <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} width={80} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Price']} labelFormatter={() => ''} />
              <Line type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}


