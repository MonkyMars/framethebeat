import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zapqcxbffugqvfiiilci.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey as string);

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: `Internal Server Error: ${error}` }, { status: 500 });
  }
}