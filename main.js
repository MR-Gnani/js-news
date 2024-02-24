const API_KEY = `2106e64e536a4ce9aede8c65a5a2a4ee`;
let newsList = [];
const allButtons = $(`#menu button, #menu-list button`);
const sBtn = $(`#searchButton`);
let url = new URL(`https://nani-news.netlify.app/top-headlines?country=kr`)
//`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`

let totalResults = 0;
let page = 1;
const pageSize = 15;
const groupSize = 5;


// Search 검색 버튼
sBtn.on("click",()=>{
    getNewsByKeyword()
    $(`#search-input`).val("")
});

// Enter키 설정
$('#search-input').keypress(function(e) { 
    if (e.which === 13) { 
        getNewsByKeyword();
        $(`#search-input`).val("");
    }
});

// 모든 버튼 클릭 이벤트
allButtons.each((index, element) => {
    $(element).on("click", (event) => {
        getNewsByCategory(event);
        $(`#sideNav`).css('width', '0');
    });
});

// News정보 세팅
const getNews = async() => {
    try {
      url.searchParams.set("page", page);
      url.searchParams.set("pageSize", pageSize);
        const response = await fetch(url);
        const data = await response.json();
        if(response.status === 200){
            if(data.articles.length === 0){
                throw new Error("No result for this search")
            }

            // articles 배열의 각 요소에 newsId 추가
            data.articles.forEach((article, index) => {
                article.newsId = index + 1;
            });

            newsList = data.articles;
            console.log(data);
            totalResults = data.totalResults;
            render();
            pageRender();
        }else{
            throw new Error(data.message)
        }
    } catch (error) {
        errorRender(error.message)
    } 
};

// 최신 뉴스 가져오기
const getLatestNews = async() => {
    page=1;
    url = new URL(
        `https://nani-news.netlify.app/top-headlines?country=kr&pageSize=20`
        //`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`
    );
    getNews();  
}

// 클릭한 뉴스 가져오기
const getNewsDetails = async(newsId) => {
    try {
        const data = newsList.find(news => news.newsId === newsId);
        detailsRender(data);
    } catch (error) {
        console.error(error.message);
    }
}

const getNewsByCategory = async (event)=>{
    page=1;
    const category = $(event.target).text().toLowerCase();
    url = new URL(
      `https://nani-news.netlify.app/top-headlines?category=${category}`
     // `https://newsapi.org/v2/top-headlines?category=${category}&country=kr&apiKey=${API_KEY}`
    ); 
    getNews();
} 

const getNewsByKeyword = async () => {
    page=1;
    const keyword = $(`#search-input`).val();
    url = new URL(
        `https://nani-news.netlify.app/top-headlines?q=${keyword}`
       // `https://newsapi.org/v2/top-headlines?category=${category}&country=kr&apiKey=${API_KEY}`
    ); 
    getNews();
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
  ` <div class="news-box" id=news-"${news.newsId}" onclick="getNewsDetails(${news.newsId})">
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

const detailsRender = (data)=>{
    console.log(data)
    $("#news-board").empty();
    $(`.pagination`).empty();
    // data.author
    // data.publishedAt
    // data.source.name
    item=`
    <div class="details">
        <div class="detailsNews"><h1>${data.title}</h1></div>
        <div class="detailsImg"><img src="${data.urlToImage ? data.urlToImage : 'images/noimage.png'}"/></div>
        <div class="detailsCap"><span>${data.description ? data.description : '내용없음'}</span></div>
        <div class="detailsAut">${data.author ? data.author : ''}</div>
        <div class="detailsEtc">
            <div>${data.source.name ? data.source.name : '출처없음'}</div>
            <div>${data.publishedAt}</div> 
        </div>
        
    </div>
    `
    $("#news-board").append(item);
}

const errorRender = (errorMessage)=>{
    $("#news-board").empty();

    const errorHTML=
   `<div class="alert alert-danger">
        <strong> Error! </strong>
        <a href="#" class="alert-link">${errorMessage}</a>.
    </div>`
  $(`#news-board`).append(errorHTML);
}

const pageRender = ()=>{
   $(`.pagination`).empty();
   
   const totalPages = Math.ceil(totalResults/pageSize);
   
   let pageGroup = Math.ceil(page/groupSize);
   
   let lastPage = pageGroup*groupSize;
   
    if(lastPage > totalPages){
        lastPage = totalPages;
    }
    
   let firstPage = lastPage-(groupSize-1)<0 ? 1 : lastPage-(groupSize-1);
  
   let pageHTML = `<li class="page-item ${page===1 ? "disabled" : ""}" onclick="moveToPage(1)"><a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span></a></li>
                   <li class="page-item ${page===1 ? "disabled" : ""}" onclick="moveToPage(${page-5>=0 ? page-5 : 1})"><a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&lt;</span></a></li>`;
   
                        
    // 최소 5개 페이지를 표시
    const startPage = Math.max(1, Math.min(page - 2, totalPages - 4));
    const endPage = Math.min(totalPages, startPage + 4);
    for (let i = startPage; i <= endPage; i++) {
        pageHTML += `<li class="page-item ${i == page ? "active" : ""}" id="pageNum-${i}" onclick="moveToPage(${i})">
                        <a class="page-link" href="#">${i}</a>
                    </li>`;
    }

    pageHTML += `<li class="page-item ${page===totalPages ? "disabled" : ""}" onclick="moveToPage(${page+5>=totalPages ? totalPages : page+5})"><a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&gt;</span></a></li>
                 <li class="page-item ${page===totalPages ? "disabled" : ""}" onclick="moveToPage(${totalPages})"><a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span></a></li>`;

   $(`.pagination`).append(pageHTML);
}

const moveToPage = (pageNum)=>{
    page=pageNum;
    getNews();
}

// page 이동버튼
$(`#pageInputBtn`).on("click",()=>{
    const pNum = $(`#pageInput`).val();
    moveToPage(pNum);
    $(`#pageInput`).val("")
});

// Enter키 설정
$('#pageInput').keypress(function(e) { 
    if (e.which === 13) { 
        const pNum = $(`#pageInput`).val();
        moveToPage(pNum);
        $(`#pageInput`).val("");
    }
});

getLatestNews();


$(`#searchIcon`).on("click", ()=> $(`#input-area`).toggle());
$(`#menuIcon`).on("click", ()=>$(`#sideNav`).css('width', '220px'));
$(`.closeBtn`).on("click", ()=>$(`#sideNav`).css('width', '0'));

// 이렇게 따로 빼도 안됨. 새로고침 해야 로딩됨ㅠㅠ. 수정예정
    // $(".news-box .image-box img").each((index, element) => {
    //    const imageUrl = $(element).attr("src");
    //    if (!validateImageUrl(imageUrl)) {
    //        $(element).attr("src", "images/noimage.png");
    //    }
    // });