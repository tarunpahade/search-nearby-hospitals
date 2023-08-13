import Users from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
       
        
        const userId = getDataFromToken(request);
        console.log('here is user id',userId);
        
        const user = await Users.findOne({ _id:new ObjectId(userId) })
        console.log('Here is me Deatils ',user);
        
        if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({message:'User Found',data:user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    }