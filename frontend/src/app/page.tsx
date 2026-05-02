'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<string>('🔍 A verificar...');

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    fetch(`${apiUrl}/ping`)
      .then((res) => res.json())
      .then((data) => setBackendStatus(`✅ Backend OK — ${data.tables?.length} tabelas`))
      .catch(() => setBackendStatus('❌ Backend offline'));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Clínica MMQ Oftalmologia</h1>
        <p className="text-xl">{backendStatus}</p>
      </div>
    </main>
  );
}
