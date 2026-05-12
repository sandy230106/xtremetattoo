import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = 'xtreme_tattoo';
const COLLECTION_NAME = 'reviews';

async function getCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection(COLLECTION_NAME);
}

async function ensureData() {
  const collection = await getCollection();
  const count = await collection.countDocuments();
  
  if (count === 0) {
    const defaultData = [
      { id: 's1', name: 'Rahul M.', comment: 'Best tattoo artist in Trichy! The attention to detail is mind-blowing.', rating: 5, date: new Date().toISOString() },
      { id: 's2', name: 'Priya S.', comment: 'Very hygienic and professional studio. Muthu made me feel completely at ease.', rating: 5, date: new Date().toISOString() },
      { id: 's3', name: 'Karthik T.', comment: 'Perfect for first-time tattoo, very comfortable experience.', rating: 5, date: new Date().toISOString() }
    ];
    await collection.insertMany(defaultData);
  }
}

export async function GET() {
  try {
    await ensureData();
    const collection = await getCollection();
    const reviews = await collection.find({}).sort({ date: -1 }).toArray();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const collection = await getCollection();
    const body = await request.json();
    const { action, review, id } = body;

    if (action === 'add') {
      await collection.insertOne({
        ...review,
        date: review.date || new Date().toISOString()
      });
      const data = await collection.find({}).sort({ date: -1 }).toArray();
      return NextResponse.json({ success: true, data });
    }

    if (action === 'delete') {
      // In MongoDB we can delete by the 'id' field provided or '_id'
      // The app seems to use a custom 'id' field
      await collection.deleteOne({ id: id });
      const newData = await collection.find({}).sort({ date: -1 }).toArray();
      return NextResponse.json({ success: true, data: newData });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

