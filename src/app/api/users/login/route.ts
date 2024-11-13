import Users from "@/dbConfig/dbConfig";
import { NextApiRequest, NextApiResponse } from "next";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { convertStreamToJson } from "@/helpers/convertStremToJson";
import { NextResponse } from "next/server";
import axios from "axios";
export async function POST(request: NextApiRequest) {
  try {
    const reqBodyb = await await convertStreamToJson(request.body);
   
console.log(reqBodyb);

    const { email, password } = reqBodyb;
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
    let fhir;
    if (!vaildPassword) {
      return NextResponse.json({ error: "Invalid Password" }, { status: 400 });
    }
    console.log(user);
    try {
      const fhirResponse = await axios.get(`https://hapi.fhir.org/baseR4/Patient?name=tarun`, {
        headers: {
          Accept: "application/json",
        },
      });
      console.log("FHIR user data:", fhirResponse.data);
      fhir=fhirResponse.data
    } catch (fhirError) {
      console.error("Error fetching FHIR data:", fhirError);
      return NextResponse.json({ error: "Error fetching FHIR data" }, { status: 500 });
    }


    //create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    console.log('this is token data',tokenData);
    
    //create tokens
    const token =  jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });
console.log(token,'this is token');

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      fhir
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
