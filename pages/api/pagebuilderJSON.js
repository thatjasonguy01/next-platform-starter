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
       
        const userCanEdit = true;
        const pagePath = path.join(process.cwd() + '/data', 'orgs/' + req.query.org + '/' + req.query.site + '/' + req.query.env + '/data/pages/', req.query.page + '.json');

        if (checkFileExists(pagePath)) {
            const page = JSON.parse( fs.readFileSync(pagePath, 'utf-8'));
            page['settings'] = {};
            const sections = ['header', 'main', 'footer'];

            sections.forEach((section) => {
            Object.keys(page[section].modules).forEach(key => {
                const modulePath =  path.join(process.cwd() + '/data', 'orgs/' + req.query.org + '/' + req.query.site + '/' + req.query.env + '/data/modules/', page[section].modules[key] + '.json');
                const moduleContent =  fs.readFileSync(modulePath, 'utf-8');
                const moduleJSON = JSON.parse(moduleContent);
                page[section]['modules'][key] = moduleJSON;

                if (req.query.mode == 'edit' && userCanEdit) {
                  page[section]['modules'][key].settings = {'mode': 'edit'};
                 }
              });
            });

            if (req.query.mode == 'edit' && userCanEdit) {
              page['settings']['mode'] = 'edit';
             }

            const sitePath = path.join(process.cwd() + '/data', 'orgs/' + req.query.org + '/' + req.query.site + '/' + req.query.env + '/data/site.json');

            if ( checkFileExists(sitePath)) {
                const site = JSON.parse( fs.readFileSync(sitePath, 'utf-8'));
                page['settings']['site']= site;
            }

            res.status(200).json({ page });
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