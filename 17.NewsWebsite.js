const API_KEY = "de4723731ca5426a95dfc566c8f34b79"; // Got from newsapi.org website,after making an account in the website.
const url = "https://newsapi.org/v2/everything?q="; // This url is a part of the real url formant present on News API website for fetching News articles. This will be used with API Key to generate news articles. q in the link means query.

window.addEventListener("load",()=> fetchNews("India"));  

async function fetchNews(query){
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`); // To bring the news , we will use fetch() method. fetch() is an asynchronous operation because news are inside the server of NEWS API Company. fetch() brings News from their, so it takes time. Therefore fetch() does not give the news suddenly , but gives a promise to bring News , so we have to wait untill this promise is fullfilled using await. fetch() will take the real url of the format that was on News Api Website. It was :- https://newsapi.org/v2/everything?q=tesla&from=2023-12-03&sortBy=publishedAt&apiKey=de4723731ca5426a95dfc566c8f34b79
    //console.log(res);
    const data = await res.json(); 
    //console.log(data); // You can see details in console. It will be like:-  {status: 'ok', totalResults: 35609, articles: Array(100)} . 100 indicates that 100 articles have been fetched from server out of 35609 articles, and stored in array variable named articles:[100].
    //console.log(data.articles);
    bindData(data.articles);
    
}

// Now we will bind our data of articles with cards. 
// We will use the card template and repeat the number of cards which will be equal to the number of articles that are present in the  array variable articles which contain image.
function bindData(articles){
    const cardsContainer = document.getElementById("cards-container");         // Accessing cards container.
    const newsCardTemplate = document.getElementById("template-news-card");   // Accessing the template of card.

    cardsContainer.innerHTML = "";   // Making an empty string variable on card container where cards will be appended.
   
    // accessing the articles array and each article is being passed into variable name article for further process.
    articles.forEach(article=>{   // Below codes from here, work one by one for each article.
        if(!article.urlToImage)   // Logic - If image is not present for an article , then , it means that the article does not have an image url. urlToImage is the variable in JSON file.
        {
            return;
        } 
        else
        {
            const cardClone = newsCardTemplate.content.cloneNode(true); // A Card made for an article.
            fillDataInCard(cardClone,article);                          // Data of an article such as image , title ,source and description filled in this card that was just made.
            cardsContainer.appendChild(cardClone);                      // The ready card is then appended to the container where cards are ment to be put.
        }
        
    })
}

// This function fills data of article in card one by one.
function fillDataInCard(cardClone,article){
    // Creating variables.
    const newsImg = cardClone.querySelector("#news-img");         
    const newsTitle = cardClone.querySelector("#news-title");    
    const newsSource = cardClone.querySelector("#news-source");  
    const newsDesc = cardClone.querySelector("#news-desc");       
    
    // Assigning data into  variable that we just made.
    newsImg.src = article.urlToImage;

    newsTitle.innerHTML = article.title;

    const date = new Date(article.publishedAt).toLocaleString("en-US",{timeZone:"Asia/Jakarta"})  // I want to show source name along with the date when article was published. Date is awailable at publishedAt JSON file variable. But date inside this is in time zone (TZ) format which is not easily readable. I will convert it into human readable  date time  format  and store it in const date variable.
    newsSource.innerHTML = `${article.source.name} • ${date}`;                                    // using back tick `` to display source and date together as a string.

    newsDesc.innerHTML = article.description;

    // Whenever you click anywhere on the card , you will be redirected to the actual article of the publishing website.
    cardClone.firstElementChild.addEventListener("click",()=>{window.open(article.url,"_blank");});  
}

let currentSelectedNav = null;

function onNavItemClick(id){
    fetchNews(id);                                  
    const navItem = document.getElementById(id);    
    currentSelectedNav?.classList.remove("active"); 
    currentSelectedNav = navItem;                   
    currentSelectedNav.classList.add("active");     
}

// Search feature.
const searchButton = document.getElementById("search-button");  
const searchText = document.getElementById("search-text");     

searchButton.addEventListener("click",()=>{                     
    const query = searchText.value;                             
    if(!query)                                                 
    {
        return;
    }
    else
    {
        fetchNews(query);                                      
    }
    currentSelectedNav?.classList.remove("active");             
    currentSelectedNav = null;                                  
})

function reload(){
    window.location.reload();  
}