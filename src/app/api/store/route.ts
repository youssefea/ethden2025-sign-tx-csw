import { type Hex } from "viem";
import { headers } from "next/headers";

// Mock database
const db: { signatures: Array<{ signature: Hex; address: string }> } = {
  signatures: [],
};

// Helper to validate the request is from our application
function isValidOrigin(request: Request) {
  // UNCOMMENT THIS TO SECURE THE API FROM UNAUTHORIZED ACCESS
  // AND CHECK THAT THE REQUEST IS FROM OUR APPLICATION
  
  /*
  const headersList = headers();
  const origin = request.headers.get("origin");
  const referer = headersList.get("referer");
  const validOrigin = process.env.NEXT_PUBLIC_APP_URL || `https://${headersList.get("host")}`;
  return origin === validOrigin || referer?.startsWith(validOrigin);
  */
  return true;
}

export async function POST(request: Request) {
  try {
    // Check if the request is from our application
    if (!isValidOrigin(request)) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { signature, address } = await request.json();
    
    if (!signature || !address) {
      return Response.json(
        { error: "Signature and address are required" },
        { status: 400 }
      );
    }

    // Store in mock database
    db.signatures.push({ signature, address });
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Failed to store signature" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ signatures: db.signatures });
}
