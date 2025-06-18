import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect'; // Adjust path as needed
import University from '@/lib/models/University';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    switch (req.method) {
        case 'GET':
            try {
                const universities = await University.find({}).sort({ createdAt: -1 });
                res.status(200).json(universities);
            } catch (error) {
                res.status(500).json({ message: 'Error fetching universities' });
            }
            break;

        case 'POST':
            try {
                const university = new University(req.body);
                await university.save();
                res.status(201).json(university);
            } catch (error: any) {
                if (error.code === 11000) {
                    res.status(400).json({ message: 'University name or slug already exists' });
                } else {
                    res.status(400).json({ message: error.message });
                }
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}