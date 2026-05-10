import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'gallery.json');

// Ensure public/uploads exists
const ensureUploadsDir = async () => {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
};

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    return NextResponse.json(JSON.parse(fileContents));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read gallery data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const action = formData.get('action');

    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);

    if (action === 'addCategory') {
      const id = formData.get('id');
      const name = formData.get('name');
      
      if (!data.categories.find(c => c.id === id)) {
        data.categories.push({ id, name });
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
      }
      return NextResponse.json({ success: true, data });
    }

    if (action === 'editCategory') {
      const id = formData.get('id');
      const newName = formData.get('newName');
      
      const category = data.categories.find(c => c.id === id);
      if (category) {
        category.name = newName;
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true, data });
      }
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (action === 'deleteCategory') {
      const id = formData.get('id');
      const categoryIndex = data.categories.findIndex(c => c.id === id);
      
      if (categoryIndex !== -1) {
        data.categories.splice(categoryIndex, 1);
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true, data });
      }
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (action === 'addImage') {
      await ensureUploadsDir();
      const file = formData.get('file');
      const category = formData.get('category');
      const title = formData.get('title');
      const desc = formData.get('desc');

      if (!file || !category) {
        return NextResponse.json({ error: 'Missing file or category' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.name) || '.jpg';
      const filename = `${uniqueSuffix}${ext}`;
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

      await fs.writeFile(filePath, buffer);

      const newItem = {
        id: Date.now(),
        category,
        img: `/uploads/${filename}`,
        alt: title || 'Tattoo Image',
        title: title || category,
        desc: desc || ''
      };

      data.items.unshift(newItem); // Add to beginning
      await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));

      return NextResponse.json({ success: true, data });
    }

    if (action === 'editImage') {
      const id = parseInt(formData.get('id'));
      const title = formData.get('title');
      const desc = formData.get('desc');
      const category = formData.get('category');

      const item = data.items.find(i => i.id === id);
      if (item) {
        if (title !== null) item.title = title;
        if (desc !== null) item.desc = desc;
        if (category !== null) item.category = category;
        
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true, data });
      }
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);

    const itemIndex = data.items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const item = data.items[itemIndex];
    
    // Optionally delete the file if it's in /uploads/
    if (item.img.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', item.img);
      try {
        await fs.unlink(filePath);
      } catch (e) {
        console.error('Failed to delete file', e);
      }
    }

    data.items.splice(itemIndex, 1);
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
