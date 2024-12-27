import { NextResponse, NextRequest } from "next/server";
import { supabase } from "../../utils/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json({ session }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}