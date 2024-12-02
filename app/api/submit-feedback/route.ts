import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  // 从请求中获取数据
  const data = await request.json()
  
  // 处理数据的逻辑
  console.log('收到的反馈数据:', data)
  
  return NextResponse.json({ message: 'Success' })
} 