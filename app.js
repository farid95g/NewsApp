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
    search(query, cb) { 
      http.get(`${apiUrl}/search?q=${query}&token=${apiKey}`, cb);
    }
  }
})();

// Elements
const form = document.forms["newsControls"];
const countrySelect = form.elements["country"];
const searchInput = form.elements["search"];

form.addEventListener("submit", e => {
  e.preventDefault();
  loadNews();
});

// Init selects
document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
  loadNews();
});


// Load news function
function loadNews() {
  showLoader();

  const country = countrySelect.value;
  const searchQuery = searchInput.value;

  if (!searchQuery) {
    newsService.topHeadlines(country, onGetResponse);
  } else {
    newsService.search(searchQuery, onGetResponse);
  }
}


// Function on get response from server
function onGetResponse(err, res) {
  removeLoader();

  if (err) {
    showAlert(err, "error-msg");
    return;
  }

  if (!res.articles.length) {
    const emptyMessage = `
    <div class="col s12 red darken-4 empty-message">
      <h3 class="align-center">We could not find the news you are looking for...</h3>
    </div>
    `;
    form.insertAdjacentHTML("afterend", emptyMessage);
    clearContainer(document.querySelector(".news-container .row"));
    return;
  }

  renderNews(res.articles);
}


// Function for rendering news
function renderNews(news) {
  const newsContainer = document.querySelector(".news-container .row");

  if (newsContainer.children) {
    clearContainer(newsContainer);
  }

  let fragment = '';

  news.forEach(newsItem => {
    const el = newsTemplate(newsItem);
    fragment += el;
  });

  if (document.querySelector(".empty-message")) {
    document.querySelector(".empty-message").remove();
  }

  newsContainer.insertAdjacentHTML("afterbegin", fragment);
}


// Function clear container
function clearContainer(container) {
  let child = container.lastElementChild;

  while (child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
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


function showAlert(msg, type = "success") {
  M.toast({ html: msg, classes: type });
}


// Show loader function
function showLoader() {
  clearContainer(document.querySelector(".news-container .row"));
  document.querySelector(".news-container .row").insertAdjacentHTML("beforebegin", `
    <div class="preloader-wrapper big active" style="margin: 0 auto !important; display: block !important;">
      <div class="spinner-layer spinner-blue-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  `);
}


// Remove loader function
function removeLoader() {
  const loader = document.querySelector(".preloader-wrapper");

  if (loader) {
    loader.remove();
  }
}