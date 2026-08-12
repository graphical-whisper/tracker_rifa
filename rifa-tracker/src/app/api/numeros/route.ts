import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'rifa.json');

export async function GET() {
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedNumber = await request.json();
    
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    const index = data.findIndex((item: any) => item.numero === updatedNumber.numero);
    
    if (index !== -1) {
      data[index] = { ...data[index], ...updatedNumber };
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
      return NextResponse.json(data[index]);
    } else {
      return NextResponse.json({ error: 'Number not found' }, { status: 404 });
    }
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
