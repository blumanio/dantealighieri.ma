import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import University from '@/lib/models/University';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    await dbConnect();

    switch (req.method) {
        case 'PUT':
            try {
                const university = await University.findByIdAndUpdate(
                    id,
                    req.body,
                    { new: true, runValidators: true }
                );

                if (!university) {
                    return res.status(404).json({ message: 'University not found' });
                }

                res.status(200).json(university);
            } catch (error: any) {
                if (error.code === 11000) {
                    res.status(400).json({ message: 'University name or slug already exists' });
                } else {
                    res.status(400).json({ message: error.message });
                }
            }
            break;

        case 'DELETE':
            try {
                const university = await University.findByIdAndDelete(id);

                if (!university) {
                    return res.status(404).json({ message: 'University not found' });
                }

                res.status(200).json({ message: 'University deleted successfully' });
            } catch (error) {
                res.status(500).json({ message: 'Error deleting university' });
            }
            break;

        default:
            res.setHeader('Allow', ['PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}