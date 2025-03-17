import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  try {
    const directoryPath = path.join(process.cwd(), 'data', '/orgs/organization1/site1/dev/data/pages');
    const files = await fs.readdir(directoryPath);

    res.status(200).json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error reading directory' });
  }
}