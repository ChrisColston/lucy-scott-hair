import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const videoPath = path.join(process.cwd(), 'public', 'LucyWebhero.mp4');
  
  try {
    // Check if file exists
    if (!fs.existsSync(videoPath)) {
      return NextResponse.json(
        { error: 'Video file not found', path: videoPath },
        { status: 404 }
      );
    }

    // Get file stats
    const stats = fs.statSync(videoPath);
    
    return NextResponse.json({
      exists: true,
      path: videoPath,
      size: stats.size,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
      permissions: {
        readable: fs.constants.R_OK ? 'OK' : 'NO_READ',
        writable: fs.constants.W_OK ? 'OK' : 'NO_WRITE',
        executable: fs.constants.X_OK ? 'OK' : 'NO_EXECUTE'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Error accessing video file',
        message: error instanceof Error ? error.message : String(error),
        path: videoPath 
      },
      { status: 500 }
    );
  }
}
