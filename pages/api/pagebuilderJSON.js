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
       
        const pagePath = path.join(process.cwd() + '/data', 'orgs/' + req.query.org + '/' + req.query.site + '/' + req.query.env + '/data/pages/', req.query.page + '.json');

        if ( checkFileExists(pagePath)) {
            const pageJSON = JSON.parse( fs.readFileSync(pagePath, 'utf-8'));
            pageJSON['settings'] = {'mode': 'edit'};
            const respJSON = {'page': pageJSON, 'modules' :{}};
            const sections = ['header', 'main', 'footer'];

            sections.forEach((section) => {
                respJSON['page'][section]['modules'].forEach( module => {
                    const modulePath =  path.join(process.cwd() + '/data', 'orgs/' + req.query.org + '/' + req.query.site + '/' + req.query.env + '/data/modules/', module + '.json');
                    const moduleContent =  fs.readFileSync(modulePath, 'utf-8');
                    const moduleJSON = JSON.parse(moduleContent);
                    moduleJSON['settings'] = {'mode': 'edit'};
                    respJSON.modules[module] = moduleJSON;
                });
            });

            res.status(200).json({ respJSON });
        } else {
            res.status(404).json({ message: 'File Not Found' });      
        }
        
    } else if (req.method === 'POST') {
      // Handle POST request
      res.status(201).json({ message: 'Data received' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }