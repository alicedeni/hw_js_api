const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const updateEnvVariables = () => {
    const dotenv = require('dotenv');
    const result = dotenv.config();
    if (result.error) {
        throw result.error;
    }
    process.env.TOKEN = result.parsed.TOKEN;
};

app.get('/', (req, res) => {
    fs.readFile('templates/resume.html', 'utf8', async (err, data) => {
        if (err) {
          res.status(500).send('Ошибка чтения файла');
          return;
        }
        updateEnvVariables();
        const t = process.env.TOKEN;
        try {
            const response = await axios.get('https://api.github.com/users/' + t);
            const userData = response.data;
            const resumeData = {
                login: userData.login,
                avatar_url: userData.avatar_url,
                name: userData.name,
                location: userData.location,
                bio: userData.bio,
                html_url: userData.html_url
            };
            const renderedHtml = ejs.render(data, { resumeData: resumeData });
            res.send(renderedHtml);
        } catch (error) {
            console.error(error);
            res.status(500).send('Ошибка получения данных с GitHub API');
        }
    });
});

app.post('/resume/token', (req, res) => {
    const token = req.body.token;
    console.log(token);
    fs.writeFile('.env', `TOKEN='${token}'`, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Ошибка записи токена в файл .env');
        } else {
            res.send('Токен успешно записан в файл .env');
            updateEnvVariables();
        }
    });
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});