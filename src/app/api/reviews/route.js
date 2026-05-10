import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'reviews.json');

async function ensureDataFile() {
  try {
    await fs.access(dataFilePath);
  } catch (e) {
    const defaultData = [
      { id: 's1', name: 'Rahul M.', comment: 'Best tattoo artist in Trichy! The attention to detail is mind-blowing.', rating: 5, date: new Date().toISOString() },
      { id: 's2', name: 'Priya S.', comment: 'Very hygienic and professional studio. Muthu made me feel completely at ease.', rating: 5, date: new Date().toISOString() },
      { id: 's3', name: 'Karthik T.', comment: 'Perfect for first-time tattoo, very comfortable experience.', rating: 5, date: new Date().toISOString() }
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

export async function POST(request) {
  await ensureDataFile();
  const data = JSON.parse(await fs.readFile(dataFilePath, 'utf8'));
  
  const body = await request.json();
  const { action, review, id } = body;

  if (action === 'add') {
    data.unshift(review);
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true, data });
  }

  if (action === 'delete') {
    const newData = data.filter(r => r.id !== id);
    await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2));
    return NextResponse.json({ success: true, data: newData });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
