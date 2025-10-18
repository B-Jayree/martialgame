import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const gameData = await request.json();
    const client = await clientPromise;
    const db = client.db('martial-peak-game');
    
    // Update or create game save
    const result = await db.collection('gamesaves').updateOne(
      { userId: session.user.id },
      { 
        $set: { 
          ...gameData,
          lastSaved: new Date(),
          userId: session.user.id
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Game saved successfully',
      gameId: result.upsertedId || session.user.id
    });
  } catch (error) {
    console.error('Save game error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save game' },
      { status: 500 }
    );
  }
}