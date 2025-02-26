import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { baseSepolia, base } from 'viem/chains';

export async function POST(request: NextRequest) {
  try {
    const { address, message, signature } = await request.json();
    const CHAIN = process.env.NODE_ENV === 'production' ? base : baseSepolia

    const publicClient = createPublicClient({
      chain: CHAIN,
      transport: http(),
    });


    const valid = await publicClient.verifyMessage({
        address: address,
        message: message,
        signature: signature,
    });
    console.log("valid", valid);

    if (valid){
        return NextResponse.json({ 
            success: true, 
            message: 'Signature verified',
            address: address 
        });
    } else {
        return NextResponse.json(
            { success: false, message: 'Invalid signature' },
            { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error verifying signature:', error);
    return NextResponse.json(
      { success: false, message: 'Invalid signature' },
      { status: 400 }
    );
  }
}