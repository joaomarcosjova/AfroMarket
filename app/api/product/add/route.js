import connectDB from "@/config/db";  // Import the database connection function
import authSeller from "@/lib/authSeller";  // Import function to check if the user is a seller
import Product from "@/models/product";  // Import the Product model
import { getAuth } from "@clerk/nextjs/server";  // Import authentication function from Clerk
import { v2 as cloudinary } from "cloudinary";  // Import Cloudinary for image upload
import { NextResponse } from "next/server";  // Import Next.js response handler

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Define the POST request handler
export async function POST(request) {
    try {
        // Get the authenticated user's ID
        const { userId } = getAuth();

        // Check if the user is an authorized seller
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not authorized' });
        }

        // Extract form data from the request
        const formData = await request.formData();
        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');
        const files = formData.getAll('images');

        // Check if files are provided
        if (!files || files.length === 0) {
            return NextResponse.json({ success: false, message: 'No files uploaded' });
        }

        // Upload images to Cloudinary
        const result = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer(); // Convert file to array buffer
                const buffer = Buffer.from(arrayBuffer); // Create a buffer from the array buffer

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: 'auto' },  // Auto-detect file type
                        (error, result) => {
                            if (error) {
                                reject(error);  // Reject promise if upload fails
                            } else {
                                resolve(result);  // Resolve promise with upload result
                            }
                        }
                    );
                    stream.end(buffer); // End the stream
                });
            })
        );

        // Extract secure URLs of uploaded images
        const image = result.map(result => result.secure_url);

        // Connect to the database
        await connectDB();

        // Create a new product in the database
        const newProduct = await Product.create({
            userId,
            name,
            description,
            category,
            price: Number(price),  // Convert price to number
            offerPrice: Number(offerPrice),  // Convert offer price to number
            image,
            date: Date.now()  // Store the current timestamp
        });

        // Return success response with the new product details
        return NextResponse.json({ success: true, message: 'Upload successful', newProduct });

    } catch (error) {
        // Return error response if any exception occurs
        return NextResponse.json({ success: false, message: error.message });
    }
}
