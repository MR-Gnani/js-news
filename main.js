const API_KEY = `2106e64e536a4ce9aede8c65a5a2a4ee`;
let newsList = [];
const getLatestNews = async() => {
    const url = new URL(
        `https://nani-news.netlify.app/top-headlines?country=kr&pageSize=20`
    );
    const response = await fetch(url);
    const data = await response.json();

    newsList = data.articles;
    render();
    console.log("info", newsList);     
}

const render = ()=>{
    const newsInfo = newsList.map(
        (news)=>
    ` <div class="news-box">
        <div class="image-box">
            <img src="${news.urlToImage}"/>
        </div>
        <div class="contents-box">
            <div class="title-box">
                <h5>${news.title}</h5>
            </div>
            <div class="caption-box">
                <p>${news.description}</p>
            </div>
            <div class="other-box">
                <div class="source">${news.author ? news.author : ''} ${news.source.name}</div>
                <div class="date">${news.publishedAt}</div>
            </div>
        </div>
    </div>`
    );
    $(`#news-board`).append(newsInfo);
}

getLatestNews();
