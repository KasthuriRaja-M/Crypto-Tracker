import axios from 'axios';
import type { Asset, AssetHistoryPoint, Interval } from './types';

const COINCAP_BASE = 'https://api.coincap.io/v2';

export async function fetchAssets(limit = 50, search?: string): Promise<Asset[]> {
  const params: Record<string, string | number> = { limit };
  if (search) params.search = search;
  const { data } = await axios.get(`${COINCAP_BASE}/assets`, { params });
  return data.data as Asset[];
}

export async function fetchAsset(id: string): Promise<Asset> {
  const { data } = await axios.get(`${COINCAP_BASE}/assets/${id}`);
  return data.data as Asset;
}

export async function fetchAssetHistory(id: string, interval: Interval = 'd1') {
  const { data } = await axios.get(`${COINCAP_BASE}/assets/${id}/history`, {
    params: { interval },
  });
  return data.data as AssetHistoryPoint[];
}

export function formatCurrency(valueUsd: string | number, maximumFractionDigits = 2) {
  const value = typeof valueUsd === 'string' ? parseFloat(valueUsd) : valueUsd;
  if (!isFinite(value)) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits,
  }).format(value);
}

export function formatNumber(value: string | number, maximumFractionDigits = 2) {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (!isFinite(num)) return '-';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  }).format(num);
}


