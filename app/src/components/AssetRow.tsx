import { Link } from 'react-router-dom';
import { formatCurrency, formatNumber } from '../api';
import type { Asset } from '../types';

interface Props {
  asset: Asset;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function AssetRow({ asset, isFavorite, onToggleFavorite }: Props) {
  const change = parseFloat(asset.changePercent24Hr);
  const changeClass = isFinite(change) ? (change >= 0 ? 'pos' : 'neg') : '';

  return (
    <tr>
      <td className="rank">{asset.rank}</td>
      <td className="name">
        <button className={`fav ${isFavorite ? 'on' : ''}`} onClick={() => onToggleFavorite(asset.id)} title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          {isFavorite ? '★' : '☆'}
        </button>
        <Link to={`/asset/${asset.id}`}>{asset.name} <span className="sym">{asset.symbol}</span></Link>
      </td>
      <td className="price">{formatCurrency(asset.priceUsd, 6)}</td>
      <td className={`change ${changeClass}`}>{isFinite(change) ? `${change.toFixed(2)}%` : '-'}</td>
      <td className="market">{formatCurrency(asset.marketCapUsd)}</td>
      <td className="volume">{formatCurrency(asset.volumeUsd24Hr)}</td>
      <td className="supply">{formatNumber(asset.supply)}</td>
    </tr>
  );
}


