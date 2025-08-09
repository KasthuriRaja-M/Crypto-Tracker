import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="brand">Crypto Tracker</Link>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Market</NavLink>
          <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active' : ''}>Favorites</NavLink>
        </nav>
      </div>
    </header>
  );
}


