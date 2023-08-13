
import { connect } from "@/dbConfig/dbConfig";
import Users from "@/dbConfig/dbConfig"; 
import { NextApiRequest, NextApiResponse } from "next";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import { convertStreamToJson } from "@/helpers/convertStremToJson";
import { sendMail } from "@/helpers/mailer";



export async function POST(request: NextApiRequest) {
  try {
    const reqBody = await convertStreamToJson(request.body);
    console.log('this is body',reqBody);
    
    
    const { username, email, password } = reqBody;


    //Check if user already exists
    const user1 = await Users.findOne({ email: email });
    if (user1) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
console.log('hashedPassword',hashedPassword);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      isVerified:false,
      isAdmin:false
    }
    const savedUser = await Users.insertOne(newUser)
    console.log('Saving the user',savedUser);

//send email
const mail=await  sendMail({email:email,emailtype:'verify',userId:savedUser.insertedId})
console.log(mail,'thsi is the sent mail');

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

