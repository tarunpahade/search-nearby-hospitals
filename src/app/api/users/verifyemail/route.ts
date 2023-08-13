import Users from "@/dbConfig/dbConfig";
import { convertStreamToJson } from "@/helpers/convertStremToJson";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { token } = reqBody;
    console.log(reqBody, token, "this is token");

    const user = await Users.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    console.log(user);

    if (!user) {
      return NextResponse.json(
        { error: "Token is invalid or has expired" },
        { status: 400 }
      );
    }
    console.log(user);
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    const userSaved = await Users.findOneAndUpdate(
      { _id: user._id }, // Specify the query to identify the document to update
      {
        $set: user,
      }
    );
console.log(userSaved,'this is user saved');

    return NextResponse.json(
      { message: "Email Verified Successfully", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
