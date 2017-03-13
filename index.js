// import config from 'config';
const config = {
  facebook: {
    appId: '1234567890',
    locale: 'en_GB',
  }
}

const loadSdk = () => {
  return new Promise((resolve, reject) => {
    if(typeof FB !== 'undefined') {
      resolve();
    }
    else {
      window.fbAsyncInit = function() {
        FB.init({
          appId: config.facebook.appId,
          xfbml: true,
          version: 'v2.8',
        });
        resolve();
      };

      (function(d, s, id) {
        let js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = `//connect.facebook.net/${config.facebook.locale}/sdk.js`;
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    }
  });
};

export const getLoginStatus = () => {
  return loadSdk().then(() => {
    return new Promise((resolve, reject) => {
      FB.getLoginStatus(response => {
        if(response.status === 'connected') {
          resolve(response.authResponse.accessToken);
        }
        else {
          return FB.login(response => {
            resolve(response);
          }, {
            scope: 'publish_actions',
          });
        }
      });
    });
  });
};

export const postImage = (props) => {
  const { accessToken, image, message } = props;
  const data = new FormData();
  data.append('access_token', accessToken);
  data.append('source', image);
  data.append('message', message);
  return fetch(
    `https://graph.facebook.com/me/photos?access_token=${accessToken}`,
    { method: 'POST', body: data }
  ).then(response => {
    return response;
  }).catch(response => {
    return response;
  });
};

export const postFeed = (props) => {
  const {
    name,
    link,
    picture,
    caption,
    description,
  } = props;
  return loadSdk().then(() => {
    return new Promise((resolve, reject) => {
      FB.ui({
        method: 'feed',
        name,
        link,
        picture,
        caption,
        description,
      }, response => {
        resolve(response);
      });
    });
  });
};

export const share = (props) => {
  const {
    description,
    link,
  } = props;
  return loadSdk().then(() => {
    return new Promise((resolve, reject) => {
      FB.ui({
        mobile_iframe: true,
        method: 'share',
        href: link,
        quote: description,
      }, response => {
        resolve(response);
      });
    });
  });
};
