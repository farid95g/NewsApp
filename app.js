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
          });
        
          xhr.addEventListener("error", () => {
            cb(`Error... Status code: ${xhr.status}!`, xhr);
          });
        
          xhr.send();
        } catch (error) {
          cb(error)
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
        cb(error)
      }
    },    
  }
}

// Init http module
const http = customHttp();

const newsService = (function () { 
  const apiKey = "6425d4455062420ca98c5a9cab2ffc14";
  const apiUrl = "http://newsapi.org/v2";

  return {
    topHeadlines() { },
    everything() { }
  }
})();

// Init selects
document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
});