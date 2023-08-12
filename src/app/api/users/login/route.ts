
import { connect } from "@/dbConfig/dbConfig";
import client from "@/dbConfig/dbConfig"; 
import { NextApiRequest, NextApiResponse } from "next";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import {convertStreamToJson }from "@/middleware/index";
import jwt from "jsonwebtoken";
export async function POST(request: NextApiRequest) {
try {

   const reqBody=await convertStreamToJson(request.body)
   console.log(reqBody);
   
const { username, password } = reqBody;

//check if user exists
const db=client.db("test");
const Users = db.collection("users");
const user= await Users.findOne({username})

if(!user){
return NextResponse.json({error:'User Not Found'}, {status:400})
}
console.log(user,'user found');

//check password is correct 
const vaildPassword= await bcryptjs.compare(password, user.password)
if(!vaildPassword){
return NextResponse.json({error:'Invalid Password'}, {status:400})
}
console.log(vaildPassword,'user had correct pass');

//create token data
const tokenData={
id:user._id,
username:user.username,
email:user.email,
}
//create token
const token=jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn:'1d'})
console.log('login successful');

const response=NextResponse.json({
message:'User logged in successfully',
success:true,
})
response.cookies.set('token', token, {
httpOnly:true
})
return response
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 });
}

}