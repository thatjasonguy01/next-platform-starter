import fs from 'fs';
import path from 'path';

async function checkFileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

export default function handler(req, res) {
    if (req.method === 'GET') {
       
    const filePath = path.join(process.cwd() + '/public', '/scripts/', 'components.json');
    
    if (checkFileExists(filePath)) {
        const config = JSON.parse( fs.readFileSync(filePath, 'utf-8'));
   
        res.status(200).json( config );
    } else {
        res.status(404).json({ message: 'File Not Found' });      
    }
  }
}

