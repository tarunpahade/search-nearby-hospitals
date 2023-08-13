import Users from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { token, password } = reqBody;
    console.log(password, token, "this is token");

    const user = await Users.findOne({
        forgetPassword: token,
        forgotPasswordToken: { $gt: Date.now() },
    });
    console.log(user);

    if (!user) {
      return NextResponse.json(
        { error: "Token is invalid or has expired" },
        { status: 400 }
      );
    }
    console.log(user);
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    console.log("hashedPassword", hashedPassword);

    user.isVerified = true;
    user.forgetPassword = undefined;
    user.forgotPasswordToken = undefined;
    user.password = hashedPassword;
    const userSaved = await Users.findOneAndUpdate(
      { _id: user._id }, // Specify the query to identify the document to update
      {
        $set: user,
      }
    );
    console.log(userSaved, "this is user saved");

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
