const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
var ans = '';

const getVkData = async (token1) => {
  const url = 'https://api.vk.com/method/users.get';
  const params = {
    access_token: token1,
    v: '5.131'
  };
  try {
    const response = await axios.get(url, { params });
    const data = response.data;

      if ('response' in data) {
        const userData = data.response[0];
        ans += 'ВК.Имя: '+ userData.first_name + '\nВК.Фамилия: ' + userData.last_name + '\n';
      } else {
        console.error('Error fetching data. Check your access token.');
      }
  } catch (error) {
    console.error(error);
  }
};

const getGitData = async (token2) => {
  const url = 'https://api.github.com/users/' + token2;
  try {
    const response = await axios.get(url);
    const data = response.data;
    ans += '\nОбо мне: ' + data.bio + '\nGitHub аккаунт: ' + data.login + '\nКоличество публичных репозиториев: ' + data.public_repos + '\n';
  } catch (error) {
    console.error(error);
  }
};

const getData = async (token3) => {
  const url = 'https://git.miem.hse.ru/api/v4/user';
  const params = {
    private_token: token3
  };
  try {
    const response = await axios.get(url, { params });
    const data = response.data;
    ans += 'ФИО ' + data.name + '\nGitLab аккаунт: ' + data.web_url + '\nПочта: ' + data.public_email + '\n';
  } catch (error) {
    console.error(error);
  }
}

const t1 = process.env.token1;
const t2 = process.env.token2;
const t3 = process.env.token3;


Promise.all([getData(t3), getGitData(t2), getVkData(t1)])
  .then(() => {
    fs.writeFile("resume_for_you.txt", ans, (err) => {
      if (err) throw err;
    });
  })
  .catch((error) => {
    console.error(error);
  });
