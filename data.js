const usersData = [
        {
          username: "testuser",
          password: "123456",
          fullname: "Test User",
          gender: "Male",
          country: "Vietnam",
          social: "https://facebook.com/testuser",
          avatar: "https://via.placeholder.com/100"
        },
        {
          username: "janedoe",
          password: "password123",
          fullname: "Jane Doe",
          gender: "Female",
          country: "USA",
          social: "https://twitter.com/janedoe",
          avatar: "https://i.9mobi.vn/cf/Images/huy/2021/12/6/anh-gai-xinh-3.jpg"
        }
      ];

      function checkLogin() {
        const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));
        if (isLoggedIn && isLoggedIn.username) {
          document.getElementById('login-modal').classList.add('hidden');
          displayUserInfo();
        } else {
          document.getElementById('login-modal').classList.remove('hidden');
        }
      }

      function validateLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const user = usersData.find(user => user.username === username && user.password === password);

        if (user) {
          const accountType = username.toLowerCase() === 'janedoe' ? 'unlimited' : 'limited';
          localStorage.setItem('isLoggedIn', JSON.stringify({ username: user.username, accountType }));
          localStorage.setItem('userInfo', JSON.stringify(user));
          document.getElementById('login-modal').classList.add('hidden');
          displayUserInfo();
        } else {
          alert('Invalid username or password.');
        }
      }

      function displayUserInfo() {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
          document.getElementById('user-avatar').src = userInfo.avatar;
          document.getElementById('info-username').innerText = userInfo.username;
          document.getElementById('info-fullname').innerText = userInfo.fullname;
          document.getElementById('info-gender').innerText = userInfo.gender;
          document.getElementById('info-country').innerText = userInfo.country;
          document.getElementById('info-social').href = userInfo.social;
          document.getElementById('user-info').classList.remove('hidden');
        }
      }
