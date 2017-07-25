(() => {
  const loadScript = (url, callback) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';

    // If the browser is Internet Explorer.
    if (script.readyState) {
      script.onreadystatechange = () => {
        if (script.readyState == 'loaded' || script.readyState == 'complete') {
          script.onreadystatechange = null;
          callback();
        }
      };
      // For any other browser.
    } else {
      script.onload = () => {
        callback();
      };
    }

    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  };

  const arr = [
    'password',
    '12345678',
    '123456789',
    'computer',
    'internet',
    '11111111',
    'superman',
    'sunshine',
    '1234567890',
    'iloveyou',
    'asdfghjkl',
    'jennifer',
    'princess',
    'mercedes',
    'alexander',
    'abcd1234',
    'whatever',
    'victoria',
    'michelle',
    '1q2w3e4r',
    'qwertyuiop',
    'football',
    'baseball',
    'trustno1',
    'samantha',
    'garfield',
    'elephant',
    'cocacola',
    'caroline',
    'benjamin',
    '88888888',
    'starwars',
    '987654321',
    '1qaz2wsx',
    'veronica',
    'security',
    'chocolate',
    'changeme',
    'nicholas',
    'creative',
    'password1',
    'maverick',
    'anderson',
    'scorpion',
    'asdf1234',
    '1234qwer',
    '123123123',
    'passw0rd',
    'midnight',
    'december',
    'carolina',
    'butterfly',
    'asdfasdf',
    'qwertyui',
    'paradise',
    'jonathan',
    'danielle',
    'champion',
    '1qazxsw2',
    'spiderman',
    'marshall'
  ];

  const commonPasswords = new Set(arr);

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const app = $ => {
    let hasError = false;
    const loggedIn = window.localStorage.getItem('loggedin');
    if (loggedIn) {
      window.location.href = '/app/dashboard';
    }
    $('.login-form').submit(e => {
      $('.error').text('\xa0');
      const username = $('#login-username').val();
      const password = $('#login-password').val();

      $.ajax({
        method: 'POST',
        url: '/app/login',
        data: {
          username,
          password
        }
      })
        .done(() => {
          window.localStorage.setItem('loggedin', true);
          window.location.href = '/app/dashboard';
        })
        .fail(() => {
          $('.error').text('Incorrect username or password');
        });

      return false;
    });

    $('#sign-up-password').blur(function(e) {
      hasError = false;
      const value = $(this).val();
      $(this).removeClass('input-error');
      $('#password-error').remove();
      if (value.length < 8) {
        $(this).addClass('input-error');
        $(this).after(
          '<p class="error" id="password-error">Short passwords are easy to guess. Try one with at least 8 characters.</p>'
        );
        hasError = true;
      } else if (commonPasswords.has(value)) {
        $(this).addClass('input-error');
        $(this).after(
          '<p class="error" id="password-error">Password strength too weak.</p>'
        );
        hasError = true;
      }
    });

    $('#sign-up-confirm').on('blur', function(e) {
      hasError = false;
      const password = $('#sign-up-password').val();
      const value = $(this).val();
      $(this).removeClass('input-error');
      $('#confirm-error').remove();

      if (password !== value) {
        $(this).addClass('input-error');
        $(this).after(
          '<p class="error" id="confirm-error">These passwords don\'t match. Try again?</p>'
        );
        hasError = true;
      }
    });

    $('#sign-up-email').blur(function(e) {
      const validEmail = emailRegex.test($(this).val());
      hasError = false;
      $(this).removeClass('input-error');
      $('#email-error').remove();
      if (!validEmail) {
        $(this).addClass('input-error');
        $(this).after(
          '<p class="error" id="email-error">Email must be valid.</p>'
        );
        hasError = true;
      }
    });

    let errors = {
      username: 'That username is taken. Try another.',
      shopify_shop_name: 'There is already a VineLink account associated with this store.'
    };

    $('#sign-up-submit').click(function(e) {
      $('#submit-error').remove();
      const request = {
        first_name: $('#sign-up-first').val(),
        last_name: $('#sign-up-last').val(),
        email: $('#sign-up-email').val(),
        username: $('#sign-up-username').val(),
        password: $('#sign-up-password').val(),
        sc_username: $('#sign-up-scuser').val(),
        sc_password: $('#sign-up-scpassword').val()
      };
      if (!hasError) {
        $.ajax({
          method: 'POST',
          url: '/app/signup',
          data: request
        })
          .then(res => {
            if (res.status === 'failure') {
              const field = res.field;
              $(this).after(
                `<p class="error" id="submit-error">${errors[field]}</p>`
              );
            } else {
              window.localStorage.setItem('loggedin', true);
              window.location.href = '/app/dashboard';
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      return;
    });
  };

  if (typeof jQuery === 'undefined' || parseFloat(jQuery.fn.jquery) < 3.2) {
    loadScript('//code.jquery.com/jquery-3.2.1.min.js', () => {
      jQuery32 = jQuery.noConflict(true);
      app(jQuery32);
    });
  } else {
    app(jQuery);
  }
})();
