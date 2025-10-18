import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('martial-peak-game');
    
    // Find user's game save
    const gameSave = await db.collection('gamesaves').findOne({
      userId: session.user.id
    });

    if (!gameSave) {
      return NextResponse.json(
        { success: false, error: 'No saved game found' },
        { status: 404 }
      );
    }

    // Remove MongoDB _id from response
    const { _id, ...gameData } = gameSave;

    return NextResponse.json({ 
      success: true, 
      gameData 
    });
  } catch (error) {
    console.error('Load game error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load game' },
      { status: 500 }
    );
  }
}