import { NextResponse } from "next/server";
import { supabase } from "../../utils/supabase";

export async function GET() {
  try {
    const { data: collection, error } = await supabase
      .from("collection")
      .select("*");
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(collection);
  } catch (error) {
    return NextResponse.json({ message: `Internal Server Error: ${error}` }, { status: 500 });
  }
}