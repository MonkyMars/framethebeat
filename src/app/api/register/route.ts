import { NextResponse, NextRequest } from "next/server";
import { supabase } from "../../utils/supabase";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
