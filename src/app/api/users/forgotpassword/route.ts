import Users from "@/dbConfig/dbConfig";
import { convertStreamToJson } from "@/helpers/convertStremToJson";
import { sendMail } from "@/helpers/mailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const reqBody = await request.json();
  const { email } = reqBody;
  const res = await sendMail({
    email: email,
    emailtype: "reset",
    userId: Math.random().toString(36).substring(10),
  });
  console.log(res);
  return NextResponse.json(
    { message: "Mail sent to Your email", success: true },
    { status: 200 }
  );
}
