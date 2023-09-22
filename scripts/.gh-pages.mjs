import { fileURLToPath } from 'url';
import { publish } from 'gh-pages';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

publish(join(__dirname, '../www/dist'), {
    repo: 'https://github.com/sumbad/web-companions.git',
    branch: 'gh-pages',
    user: {
        name: 'sumbad',
        email: 'sumbad@ya.ru'
    }
}, function (err) {
    console.log(err || 'END DEPLOY SUCCESS')
});