/* eslint-disable */
export const runtime = 'nodejs';
import connectDB from "@/utils/connectDB";

export async function GET() {
    try {
        await connectDB();
        console.log("Database connected successfully.......");
        return new Response(JSON.stringify({ message: "Alhamdulillah......" }), { status: 200 });

    } catch (error) {
        console.error("Error fetching.........:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}
