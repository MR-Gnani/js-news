const API_KEY = `2106e64e536a4ce9aede8c65a5a2a4ee`;
let news = [];
const getLatestNews = async() => {
    const url = new URL(
        `https://nani-news.netlify.app/top-headlines?country=kr&pageSize=5`
    );
    const response = await fetch(url);
    const data = await response.json();

    news = data.articles;
}

getLatestNews();