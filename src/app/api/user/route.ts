import { NextResponse } from "next/server";
import { supabase } from "../../utils/supabase";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY as string;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing required Supabase environment variables");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function PATCH(req: Request) {
  try {
    const { email, password } = await req.json();
    const {
      data: { session },
    } = await supabaseAdmin.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const updateData: { email?: string; password?: string } = {};
    if (email) updateData.email = email;
    if (password) updateData.password = password;

    const { data: user, error } = await supabaseAdmin.auth.updateUser(updateData);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { user_id } = await req.json();
    const { error: SavedError } = await supabase
      .from("saved")
      .delete()
      .eq("user_id", user_id);

    const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id);
    if (error || SavedError) {
      throw new Error(`HTTP error! status: ${error}`);
    }
    return {
      message: "User deleted successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
