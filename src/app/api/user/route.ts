import { NextResponse } from "next/server";
import { supabase } from "../../utils/supabase";
// import { createClient } from '@supabase/supabase-js';
// WORKING ON A 401 FIX. ISSUE IS WITH PASSING THRU AUTH.
// // const supabaseAuth = createClient(
// //   process.env.SUPABASE_URL as string,
// //   process.env.SUPABASE_ANON_KEY as string,
// //   {
// //     auth: {
// //       autoRefreshToken: false,
// //       persistSession: false,
// //       headers: {
// //         Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`
// //       }
// //     }
// //   }
// // )

export async function PATCH(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log(await supabase.auth.getSession());
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const updateData: { email?: string; password?: string } = {};
    if (email) updateData.email = email;
    if (password) updateData.password = password;

    const { data: user, error } = await supabase.auth.updateUser(updateData);
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
