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

// imageUrl 유효성 검사
const validateImageUrl = (imageUrl) => {
    // image객체 생성. 자바스크립트가 가지고 있는 인스턴스
    const image = new Image();
    // src속성 할당 (render함수에서 가져온 url)
    image.src = imageUrl;
    // 1. src속성이 할당되었기에 image.complete로 이미지 로딩되었는지 체크
    // 2. 이미지의 가로 세로폭이 0보다 큰지 체크 (크면 이미지가 로딩되었다고 판단)
    // 둘다 만족하면 true, 하나라도 만족하지 않으면 false값 반환
    return image.complete && (image.width + image.height) > 0;
  };

const render = ()=>{
    const newsInfo = newsList.map(
        (news)=>{
            const imageUrl = news.urlToImage;
            // 유효성 검사 결과값 담기
            const validatedImage = validateImageUrl(imageUrl);

            // 이미지에서 유효한 값이 아니라면 noimage 
    return` <div class="news-box">
        <div class="image-box">
            <img src="${validatedImage ? imageUrl : 'images/noimage.png'}"/>
        </div>
        <div class="contents-box">
            <div class="title-box">
                <h5>${news.title}</h5>
            </div>
            <div class="caption-box">
                <p>${news.description ? news.description : '내용없음'}</p>
            </div>
            <div class="other-box">
                <div class="source">${news.author ? news.author : ''} ${news.source.name ? news.source.name : 'no source'}</div>
                <div class="date">${moment(news.publishedAt).startOf('hour').fromNow()}</div>
            </div>
        </div>
    </div>`
        });
    $(`#news-board`).append(newsInfo);
}

getLatestNews();
