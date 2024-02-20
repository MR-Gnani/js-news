const API_KEY = `2106e64e536a4ce9aede8c65a5a2a4ee`;
let news = [];
const getLatestNews = async() => {
    const url = new URL(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
    );
    const response = await fetch(url);
    const data = await response.json();

    news = data.articles;
}

getLatestNews();