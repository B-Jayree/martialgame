import { NextResponse } from 'next/server';
import { CombatEngine } from '@/lib/gameEngine/combat';

export async function POST(request) {
  try {
    const { player, enemy, action } = await request.json();
    const results = CombatEngine.executeTurn(player, enemy, action);
    
    return NextResponse.json({ 
      success: true, 
      results,
      player,
      enemy
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Combat failed' },
      { status: 500 }
    );
  }
}