// Custom http module
function customHttp() {
  return {
    get(url, cb) {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open("GET", url);

          xhr.addEventListener("load", () => {
            if (Math.floor(xhr.status / 100) !== 2) {
              cb(`Error... Status code: ${xhr.status}!`, xhr);
              return;
            }
            const response = JSON.parse(xhr.responseText);
            cb(null, response);
          });
        
          xhr.addEventListener("error", () => {
            cb(`Error... Status code: ${xhr.status}!`, xhr);
          });
        
          xhr.send();
        } catch (error) {
          cb(error);
        }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
            
        xhr.addEventListener("load", () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error... Status code: ${xhr.status}!`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });
      
        xhr.addEventListener("error", () => {
          cb(`Error... Status code: ${xhr.status}!`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }
      
        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },    
  }
}

// Init http module
const http = customHttp();

const newsService = (function () { 
  const apiKey = "00767ad3c6d218328ec8b5ec588b14d6";
  const apiUrl = "https://gnews.io/api/v4";

  return {
    topHeadlines(country = "ua", cb) { 
      http.get(`${apiUrl}/top-headlines?token=${apiKey}&country=${country}`, cb);
    },
    everything(query, cb) { 
      http.get(`${apiUrl}/search?q=${query}&token=${apiKey}`, cb);
    }
  }
})();

// Init selects
document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
  loadNews();  // We are getting an object with the field "articles" which is an array of 20 objects, and each object has author, content, description, publishedAt, source, title, url, and urlToImage fields.
});


// Load news function
function loadNews() {
  newsService.topHeadlines('ua', onGetResponse);
}


// Function on get response from server
function onGetResponse(err, res) {
  renderNews(res.articles);
  console.log(res.articles);
}


// Function for rendering news
function renderNews(news) {
  const newsContainer = document.querySelector(".news-container .row");
  let fragment = '';

  news.forEach(newsItem => {
    const el = newsTemplate(newsItem);
    fragment += el;
  });

  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}


// News item template function
function newsTemplate({ description, image, title, url }) {
  return `
    <div class="col s6">
      <div class="card">
        <div class="card-image">
          <img src="${image}" />
          <span class="card-title">${title || ''}</span>
        </div>
        <div class="card-content">
          <p>${description || ''}</p>
        </div>
        <div class="card-action">
          <a href="${url}">Read more...</a>
        </div>
      </div>
    </div>
  `;
}