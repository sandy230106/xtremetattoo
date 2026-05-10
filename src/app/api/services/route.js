import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'services.json');

async function ensureDataFile() {
  try {
    await fs.access(dataFilePath);
  } catch (e) {
    const defaultData = [
      { id: '1', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>', title: 'Custom Tattoos', desc: 'We design unique tattoos that tell your personal story. No copy-pasting, just pure art.' },
      { id: '2', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', title: 'Portrait Tattoos', desc: 'Hyper-realistic portraits capturing every fine detail to immortalize your loved ones.' },
      { id: '3', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>', title: 'Realism', desc: 'Hyper-accurate, lifelike designs that capture reality with stunning precision.' },
      { id: '4', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20"/><path d="M12 22L6 9"/><path d="M12 22l6-13"/></svg>', title: 'Piercing', desc: 'Professional and hygienic body piercing with a wide selection of premium jewelry.' },
      { id: '5', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>', title: 'Cover-ups', desc: 'Transform your regretful ink into a masterpiece you\'ll be proud to show off.' },
      { id: '6', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>', title: 'Tattoo Removal', desc: 'Safe and effective laser removal services to clear the canvas for your next piece.' }
    ];
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2));
  }
}

export async function GET() {
  await ensureDataFile();
  const fileContent = await fs.readFile(dataFilePath, 'utf8');
  return NextResponse.json(JSON.parse(fileContent));
}

function getIconForTitle(title) {
  const t = title.toLowerCase();
  
  // Specific keywords first
  if (t.includes('portrait')) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  if (t.includes('realism') || t.includes('real')) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  if (t.includes('piercing')) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20"/><path d="M12 22L6 9"/><path d="M12 22l6-13"/></svg>';
  if (t.includes('cover')) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>';
  if (t.includes('remov') || t.includes('laser')) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>';
  if (t.includes('custom') || t.includes('design')) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>';
  if (t.includes('minimal') || t.includes('small')) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M17.66 4.93l-1.41 1.41"/><path d="M4.93 17.66l-1.41 1.41"/></svg>';

  // Fallback to hash-based selection from a pool
  const icons = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.27 1.27L3 12l5.813 1.912a2 2 0 0 1 1.27 1.27L12 21l1.912-5.813a2 2 0 0 1 1.27-1.27L21 12l-5.813-1.912a2 2 0 0 1-1.27-1.27L12 3Z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.5-1 1-4c1.5 0 3 0 4 4z"/><path d="m15 9 3 3"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-10 10Z"/><path d="M11 20c-4 0-6-3-6-3"/><path d="M11 20c2-2 2-5 2-5"/><path d="M11 20c-2-2-2-5-2-5"/></svg>'
  ];
  
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % icons.length;
  return icons[index];
}

export async function POST(request) {
  await ensureDataFile();
  const data = JSON.parse(await fs.readFile(dataFilePath, 'utf8'));
  
  const body = await request.json();
  const { action, service, id } = body;

  if (action === 'add') {
    service.id = Date.now().toString();
    if (!service.icon) {
      service.icon = getIconForTitle(service.title);
    }
    data.push(service);
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true, data });
  }

  if (action === 'edit') {
    const index = data.findIndex(s => s.id === id);
    if (index !== -1) {
      if (!service.icon) {
        service.icon = getIconForTitle(service.title);
      }
      data[index] = { ...data[index], ...service };
      await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
      return NextResponse.json({ success: true, data });
    }
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  if (action === 'delete') {
    const newData = data.filter(s => s.id !== id);
    await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2));
    return NextResponse.json({ success: true, data: newData });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
