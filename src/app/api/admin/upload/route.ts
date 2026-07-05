import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Lock to admin only
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create the upload directory path
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate clean unique filename
    const fileExt = path.extname(file.name) || '.jpg';
    const filename = `${crypto.randomUUID()}${fileExt}`;
    const filePath = path.join(uploadDir, filename);

    // Write file to server disk
    await writeFile(filePath, buffer);

    return NextResponse.json({
      imageUrl: `/uploads/${filename}`,
      message: 'Image uploaded successfully!'
    }, { status: 200 });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
