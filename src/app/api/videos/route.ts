import { authOptions } from "@/lib/auth";
import { connectToDb } from "@/lib/db";
import Video from "@/models/videos.model";
import { getServerSideProps } from "next/dist/build/templates/pages";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDb();
        const videos = await Video.find({}).sort({createdAt: -1}).lean();   
        
        if(!videos || videos.length==0){
            return NextResponse.json([], {status: 200});
        }

        return NextResponse.json(videos);
    } 
    catch (error) {
        return NextResponse.json(
            {error: "Failed to get videos"},
            {status: 400},
        );
    }    
}

export async function POST(request: NextRequest){
    
    try {
        const session= await getServerSideProps(authOptions);
        if(!session){
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401},
            );
        }   
        
        await connectToDb();
        const body = await request.json();

        if(
            !body.title||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ){
            return NextResponse.json(
                {error: "Enter all the fields"},
                {status: 400},
            );
        }

        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformations: {
                height: 1920,
                width: 1080,
                quality: body.transformations?.quality ?? 100,
            },
        };

        const newVideo = await Video.create(videoData);

        return NextResponse.json(newVideo);

    } 
    catch (error) {
        return NextResponse.json(
            {error: "Failed to create a video"},
            {status: 400},
        );
    }
}