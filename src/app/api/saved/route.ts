import { NextResponse } from "next/server";
import { supabase } from "../../utils/supabase";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const { data: saved, error } = await supabase
      .from("saved")
      .select("*")
      .eq("user_id", user_id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(saved);
  } catch (error) {
    return NextResponse.json(
      { message: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { artist, album, user_id } = await req.json();
    const { data, error } = await supabase
      .from("saved")
      .insert([{ artist, album, user_id }]);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { artist, album, user_id } = await req.json();
    const { data, error } = await supabase
      .from("saved")
      .delete()
      .eq("artist", artist)
      .eq("album", album)
      .eq("user_id", user_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
