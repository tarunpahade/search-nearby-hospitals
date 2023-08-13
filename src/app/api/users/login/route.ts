import Users from "@/dbConfig/dbConfig";
import { NextApiRequest, NextApiResponse } from "next";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { convertStreamToJson } from "@/helpers/convertStremToJson";
import { NextResponse } from "next/server";
export async function POST(request: NextApiRequest) {
  try {
    const reqBody = await convertStreamToJson(request.body);
   

    const { email, password } = reqBody;

    //check if user exists
  
    const user = await Users.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    console.log("user already exists",user ,email);

    //check password is correct
    const vaildPassword = await bcryptjs.compare(password, user.password);
    console.log(vaildPassword);
    
    if (!vaildPassword) {
      return NextResponse.json({ error: "Invalid Password" }, { status: 400 });
    }
    console.log(user);

    //create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    console.log('this is token data',tokenData);
    
    //create tokens
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });
console.log(token,'this is token');

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
