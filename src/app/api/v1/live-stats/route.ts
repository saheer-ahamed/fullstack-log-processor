import { NextRequest } from "next/server";
import { getIO } from "@/src/utils/socket";

export async function GET(req: NextRequest) {
    const io = getIO();
    return new Response(null, { status: 101 });
}