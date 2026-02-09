import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import styles from './MainLayout.module.scss';

export interface LayoutContext {
  searchQuery: string;
}

export default function MainLayout() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={styles.layout}>
      <Header onSearch={setSearchQuery} />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.content}>
          <Outlet context={{ searchQuery } satisfies LayoutContext} />
        </main>
      </div>
    </div>
  );
}
