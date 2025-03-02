import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
    
    const filePath = path.join(process.cwd() + '/public', '/sites/site1/data/pages/', 'home.json');
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('file not found')
    }

    const response = await fetch(filePath);
    const data = await response.json();
//    res.status(200).json(data);

    res.status(200).json({ 'found': 'hi' })
  }

