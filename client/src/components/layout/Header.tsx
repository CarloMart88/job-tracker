import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../ui/SearchBar';
import styles from './Header.module.scss';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.trim()) {
      navigate('/applications');
    }
    onSearch(value);
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Job Tracker</h1>
      <div className={styles.search}>
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search companies, positions..."
        />
      </div>
    </header>
  );
}
