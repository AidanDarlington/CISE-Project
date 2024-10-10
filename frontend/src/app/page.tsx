'use client'

import React, { useEffect, useState } from 'react';
import ViewerHome from '@/components/ViewerHome';
import AnalystHome from '@/components/AnalystHome';
import AdminHome from '@/components/AdminHome';

export default function Home() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    let storedRole = localStorage.getItem('role');
    if (!storedRole) {
      storedRole = 'viewer';
      localStorage.setItem('role', storedRole);
    }
    setRole(storedRole);
  }, []);

  if (role === null) {
    return <div>Loading...</div>; // or a loading spinner
  }

  return (
    <main>
      {role === 'admin' && (
        <>
          <AdminHome />
        </>
      )}
      {role === 'analyst' && (
        <>
          <AnalystHome />
        </>
      )}
      {role === 'viewer' && (
        <>
          <ViewerHome />
        </>
      )}
    </main>
  );
}