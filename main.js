const API_KEY = `2106e64e536a4ce9aede8c65a5a2a4ee`;
let newsList = [];
const allButtons = $(`#menu button, #menu-list button`);

// 모든 버튼 클릭 이벤트
allButtons.each((index, element) => {
    $(element).on("click", (event) => {
        getNewsByCategory(event);
        $(`#sideNav`).css('width', '0');
    });
});

const getLatestNews = async() => {
    const url = new URL(
        `https://nani-news.netlify.app/top-headlines?country=kr&pageSize=20`
        //`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
    );
    const response = await fetch(url);
    const data = await response.json();

    newsList = data.articles;
    render();
    
    // 이렇게 따로 빼도 안됨. 새로고침 해야 로딩됨ㅠㅠ. 수정예정
    // $(".news-box .image-box img").each((index, element) => {
    //    const imageUrl = $(element).attr("src");
    //    if (!validateImageUrl(imageUrl)) {
    //        $(element).attr("src", "images/noimage.png");
    //    }
    // });
}

const getNewsByCategory = async (event)=>{
    const category = $(event.target).text().toLowerCase();
    console.log("category", category);
    const url = new URL(
      `https://nani-news.netlify.app/top-headlines?category=${category}`
     // `https://newsapi.org/v2/top-headlines?category=${category}&country=kr&apiKey=${API_KEY}`
    ); 
    const response = await fetch(url);
    const data = await response.json();
    console.log("d", data);
    newsList = data.articles;
    render();
} 

// 수정중 
// imageUrl 유효성 검사
const validateImageUrl = (imageUrl) => {
    // image객체 생성. 자바스크립트가 가지고 있는 인스턴스
    const image = new Image();
    // src속성 할당 (render함수에서 가져온 url)
    image.src = imageUrl;
    return image.complete;
  };

const render = ()=>{
    $("#news-board").empty();

    const newsInfo = newsList.map(
        (news)=>
  ` <div class="news-box">
        <div class="image-box">
            <img src="${news.urlToImage ? news.urlToImage : 'images/noimage.png'}"/>
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
        );
    $(`#news-board`).append(newsInfo);
}

getLatestNews();

$(`#searchIcon`).on("click", ()=> $(`#input-area`).toggle());
$(`#menuIcon`).on("click", ()=>$(`#sideNav`).css('width', '220px'));
$(`.closeBtn`).on("click", ()=>$(`#sideNav`).css('width', '0'));

