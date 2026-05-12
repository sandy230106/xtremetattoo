import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';
import fs from 'fs/promises';
import path from 'path';

const DB_NAME = 'xtreme_tattoo';
const CAT_COLLECTION = 'gallery_categories';
const ITEM_COLLECTION = 'gallery_items';

async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

async function ensureData() {
  const db = await getDb();
  const catCount = await db.collection(CAT_COLLECTION).countDocuments();
  
  if (catCount === 0) {
    // Seed from gallery.json if it exists, otherwise use defaults
    try {
      const dataPath = path.join(process.cwd(), 'data', 'gallery.json');
      const fileContents = await fs.readFile(dataPath, 'utf8');
      const data = JSON.parse(fileContents);
      if (data.categories?.length > 0) {
        await db.collection(CAT_COLLECTION).insertMany(data.categories);
      }
      if (data.items?.length > 0) {
        await db.collection(ITEM_COLLECTION).insertMany(data.items);
      }
    } catch (e) {
      console.warn('Could not seed from gallery.json, using empty defaults');
    }
  }
}

export async function GET() {
  try {
    await ensureData();
    const db = await getDb();
    const categories = await db.collection(CAT_COLLECTION).find({}).toArray();
    const items = await db.collection(ITEM_COLLECTION).find({}).sort({ id: -1 }).toArray();
    return NextResponse.json({ categories, items });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to read gallery data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = await getDb();
    const formData = await request.formData();
    const action = formData.get('action');

    if (action === 'addCategory') {
      const id = formData.get('id');
      const name = formData.get('name');
      
      const existing = await db.collection(CAT_COLLECTION).findOne({ id });
      if (!existing) {
        await db.collection(CAT_COLLECTION).insertOne({ id, name });
      }
      
      const categories = await db.collection(CAT_COLLECTION).find({}).toArray();
      const items = await db.collection(ITEM_COLLECTION).find({}).sort({ id: -1 }).toArray();
      return NextResponse.json({ success: true, data: { categories, items } });
    }

    if (action === 'editCategory') {
      const id = formData.get('id');
      const newName = formData.get('newName');
      
      await db.collection(CAT_COLLECTION).updateOne({ id }, { $set: { name: newName } });
      
      const categories = await db.collection(CAT_COLLECTION).find({}).toArray();
      const items = await db.collection(ITEM_COLLECTION).find({}).sort({ id: -1 }).toArray();
      return NextResponse.json({ success: true, data: { categories, items } });
    }

    if (action === 'deleteCategory') {
      const id = formData.get('id');
      await db.collection(CAT_COLLECTION).deleteOne({ id });
      
      const categories = await db.collection(CAT_COLLECTION).find({}).toArray();
      const items = await db.collection(ITEM_COLLECTION).find({}).sort({ id: -1 }).toArray();
      return NextResponse.json({ success: true, data: { categories, items } });
    }

    if (action === 'addImage') {
      const file = formData.get('file');
      const category = formData.get('category');
      const title = formData.get('title');
      const desc = formData.get('desc');

      if (!file || !category) {
        return NextResponse.json({ error: 'Missing file or category' }, { status: 400 });
      }

      let imgUrl = '';
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary using a Promise wrapper for the stream
        const uploadResponse = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'xtreme_tattoo_gallery',
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        imgUrl = uploadResponse.secure_url;
      } catch (e) {
        console.error('Cloudinary upload error:', e);
        return NextResponse.json({ 
          error: 'Image upload failed. Check your Cloudinary configuration.',
          details: e.message 
        }, { status: 500 });
      }

      const newItem = {
        id: Date.now(),
        category,
        img: imgUrl,
        alt: title || 'Tattoo Image',
        title: title || category,
        desc: desc || ''
      };

      await db.collection(ITEM_COLLECTION).insertOne(newItem);

      const categories = await db.collection(CAT_COLLECTION).find({}).toArray();
      const items = await db.collection(ITEM_COLLECTION).find({}).sort({ id: -1 }).toArray();
      return NextResponse.json({ success: true, data: { categories, items } });
    }


    if (action === 'editImage') {
      const id = parseInt(formData.get('id'));
      const title = formData.get('title');
      const desc = formData.get('desc');
      const category = formData.get('category');

      const updateData = {};
      if (title !== null) updateData.title = title;
      if (desc !== null) updateData.desc = desc;
      if (category !== null) updateData.category = category;

      await db.collection(ITEM_COLLECTION).updateOne({ id }, { $set: updateData });
      
      const categories = await db.collection(CAT_COLLECTION).find({}).toArray();
      const items = await db.collection(ITEM_COLLECTION).find({}).sort({ id: -1 }).toArray();
      return NextResponse.json({ success: true, data: { categories, items } });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const item = await db.collection(ITEM_COLLECTION).findOne({ id });
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Delete image from storage
    if (item.img.includes('cloudinary.com')) {
      // Extract public_id from Cloudinary URL
      // Example: https://res.cloudinary.com/cloudname/image/upload/v12345/folder/public_id.jpg
      try {
        const parts = item.img.split('/');
        const fileNameWithExt = parts[parts.length - 1];
        const fileName = fileNameWithExt.split('.')[0];
        
        // Find the folder part if exists
        // This is a simple version, might need adjustment based on folder structure
        const folder = 'xtreme_tattoo_gallery'; 
        const publicId = `${folder}/${fileName}`;
        
        await cloudinary.uploader.destroy(publicId);
      } catch (e) {
        console.error('Failed to delete from Cloudinary:', e);
      }
    } else if (item.img.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', item.img);
      try {
        await fs.unlink(filePath);
      } catch (e) {
        console.error('Failed to delete file (likely read-only FS):', e);
      }
    }


    await db.collection(ITEM_COLLECTION).deleteOne({ id });

    const categories = await db.collection(CAT_COLLECTION).find({}).toArray();
    const items = await db.collection(ITEM_COLLECTION).find({}).sort({ id: -1 }).toArray();
    return NextResponse.json({ success: true, data: { categories, items } });

  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

