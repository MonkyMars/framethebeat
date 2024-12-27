import { NextResponse, NextRequest } from "next/server";
import { supabase } from "../../utils/supabase";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();
  try {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: `Internal Server Error: ${error}` }, { status: 500 });
  }
}