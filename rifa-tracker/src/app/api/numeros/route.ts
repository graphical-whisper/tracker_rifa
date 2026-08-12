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
    const payload = await request.json();
    
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    if (Array.isArray(payload)) {
      const updatedList: any[] = [];
      payload.forEach((item: any) => {
        const index = data.findIndex((existing: any) => existing.numero === item.numero);
        if (index !== -1) {
          data[index] = { ...data[index], ...item };
          updatedList.push(data[index]);
        }
      });
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
      return NextResponse.json(updatedList);
    } else {
      const index = data.findIndex((item: any) => item.numero === payload.numero);
      
      if (index !== -1) {
        data[index] = { ...data[index], ...payload };
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
        return NextResponse.json(data[index]);
      } else {
        return NextResponse.json({ error: 'Number not found' }, { status: 404 });
      }
    }
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { numero } = await request.json();
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    const index = data.findIndex((item: any) => item.numero === numero);
    if (index === -1) {
      return NextResponse.json({ error: 'Number not found' }, { status: 404 });
    }
    const [removed] = data.splice(index, 1);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json(removed);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
