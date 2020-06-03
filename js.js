//7小時


let data = new XMLHttpRequest();
data.open("get", "https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97", true);
data.send(null);


data.onload = () => {

    let dataTxt = JSON.parse(data.responseText);
    let dataTotal = dataTxt.result.records;
    const seletZone = document.querySelector(".select select");
    //分頁用
    let offset = 0;
    const PAGE_SIZE = 10;
    let SELECT_ZONE_FINA;




    //地區清單的HTML

    const getZone = data => `
    <option value="${data}">${data}</option>
    `;


    //印出所有地區清單
    const zoneList = zoneData => {
        seletZone.innerHTML = `<option style="display: none">---請選擇地區--</option> ${zoneData}`;
    }

    zoneList(dataTotal
        .map(data => data.Zone) //篩選出地區
        .filter((element, index, arr) => arr.indexOf(element) === index) //篩選掉重複
        .map(data => getZone(data)) //印出地區
        .join(''));



    //分頁數字

    const pageCount = html => {
        let count;

        if(html%10 ===0){
            count = parseInt(html / 10) ;

        }else{
            count = parseInt(html / 10) + 1;
        }

       // const count = parseInt(html / 10) + 1;

        let arr = [];
        for (let i = 1; i <= count; i++) {
            arr.push(i);
        }
        return arr;
    }

    const pglisthtml = pageCount => {
        const pglist = document.querySelector(".pglist"); //分頁數字
        pglist.innerHTML = pageCount.map(pagecount => `<li>${pagecount}</li>`).join('');

        //點選分頁數字跳頁
        const pglistall = document.querySelectorAll(".pglist li");

        pglistall.forEach((e, i) => {
            if (i === 0) e.classList.add("inthis");
            e.addEventListener("click", () => {
                pglistall.forEach((e,i)=>{
                    e.classList.remove("inthis");
                })
                pglistall[i].classList.add("inthis");
                offset = 0;
                const pageset = parseInt(e.textContent) - 1;
                offset = pageset * 10;
                let html;
                if (!SELECT_ZONE_FINA) {
                    html = dataTotal;
                } else {
                    html = dataTotal
                        .filter(data => data.Zone === SELECT_ZONE_FINA);
                }

                hotelList(html.slice(offset, offset + PAGE_SIZE)
                    .map(data => darea3Data(data)).join(''));
                window.scrollTo({
                    top: hotLocation.offsetTop,
                    behavior: "smooth"
                });

                console.log(offset+"頁");
                if (offset === 0) {
                    prev.classList.add("full");
                    next.classList.remove("full");
                }else if(offset + PAGE_SIZE >= html.length){
                    next.classList.add("full");
                    prev.classList.remove("full");

                }else{
                    prev.classList.remove("full");
                    next.classList.remove("full");

                }

            })
        })


    }
//分頁

const prev = document.querySelector("#Prev");
const next = document.querySelector("#Next");
prev.classList.add("full");



prev.addEventListener("click", () => {
    window.scrollTo({
        top: hotLocation.offsetTop,
        behavior: "smooth"
    });

    next.classList.remove("full");
    if (prev.classList.contains("full")) return;
    offset = offset - PAGE_SIZE;

    if (offset === 0) {
        prev.classList.add("full");

    }

        let html;
                if (!SELECT_ZONE_FINA) {
                    html = dataTotal;
                } else {
                    html = dataTotal
                        .filter(data => data.Zone === SELECT_ZONE_FINA);
                }

                hotelList(html.slice(offset, offset + PAGE_SIZE)
                    .map(data => darea3Data(data)).join(''));
        console.log(offset+"頁");

        const pglistall = document.querySelectorAll(".pglist li");
        pglistall.forEach((e,i)=>{
            e.classList.remove("inthis");
        })
        pglistall[offset/10].classList.add("inthis");


})

next.addEventListener("click", () => {
    window.scrollTo({
        top: hotLocation.offsetTop,
        behavior: "smooth"
    });
    prev.classList.remove("full");
    if (next.classList.contains("full")) return;

    offset = offset + PAGE_SIZE;
    console.log(offset)

    let html;
    if (!SELECT_ZONE_FINA) {
        html = dataTotal;
    } else {
        html = dataTotal
            .filter(data => data.Zone === SELECT_ZONE_FINA);
    }

    hotelList(html.slice(offset, offset + PAGE_SIZE)
        .map(data => darea3Data(data)).join(''));
    if (offset + PAGE_SIZE >= html.length) {
        next.classList.add("full")
    }
    const pglistall = document.querySelectorAll(".pglist li");
        pglistall.forEach((e,i)=>{
            e.classList.remove("inthis");
        })
        pglistall[offset/10].classList.add("inthis");
    console.log(offset+"頁");
})


    //篩選hotel內容

    function seletAll(e) {
        let zoneName = e.target.value;
        SELECT_ZONE_FINA = zoneName;
        offset = 0;
        next.classList.remove("full");
        prev.classList.add("full");

        let html = dataTotal
            .filter(data => data.Zone === zoneName)

        hotelList(html.slice(offset, offset + PAGE_SIZE)
            .map(data => darea3Data(data)).join(''));
        countContent(getCount(zoneName, html.length));
        pglisthtml(pageCount(html.length));
        if (offset + PAGE_SIZE >= html.length) {
            next.classList.add("full")
        }



    }

    seletZone.addEventListener("change", seletAll);

    //篩選熱門行政區
    const hotLocation = document.querySelector(".location");
    hotLocation.addEventListener("click", function(e) {
        if (e.target.nodeName !== "A") { return }
        e.preventDefault();
        let zoneName = e.target.textContent;
        offset = 0;
        next.classList.remove("full");
        prev.classList.add("full");
        SELECT_ZONE_FINA = zoneName;
        let html = dataTotal
            .filter(data => data.Zone === zoneName)
        hotelList(html.slice(offset, offset + PAGE_SIZE)
            .map(data => darea3Data(data)).join(''));
        countContent(getCount(zoneName, html.length));
        pglisthtml(pageCount(html.length));
        if (offset + PAGE_SIZE >= html.length) {
            next.classList.add("full")
        }


    })


    //搜了多少資料?

    const getCount = (zone, data) => `${zone}共搜尋<span>${data}</span>筆資料。`;
    const countContent = html => {
        const count = document.querySelector("#count");
        count.innerHTML = html;
    }




    //Hotel html

    const darea3Data = ({ Name, Add, Opentime, Tel, Ticketinfo, Picture1 }) => {
        if (`${Ticketinfo}` !== "") {
            return `
            <div class="col-6 col-m12 list animated">
                <a>
                    <figure class="col-12">
                        <h4>${Name}</h4>
                        <img src="${Picture1}" alt="" class="rwdimg">
                    </figure>
                    <div class="col-12 hotelinfo">
                    <ul>
                        <li>${Opentime}</li>
                        <li>${Add}</li>
                        <li><img src="image/icon-call.jpg" alt="">${Tel}</li>
                        <li id="info"><img src="image/icon-memo.jpg" alt="">${Ticketinfo}</li>
                        </ul>
                    </div>
                </a>
            </div>`;

        } else {
            return `
            <div class="col-6 col-m12 list animated">
                <a>
                    <figure class="col-12">
                        <h4>${Name}</h4>
                        <img src="${Picture1}" alt="" class="rwdimg">
                    </figure>
                    <div class="col-12 hotelinfo">
                    <ul>
                        <li>${Opentime}</li>
                        <li>${Add}</li>
                        <li><img src="image/icon-call.jpg" alt="">${Tel}</li>
                        </ul>
                    </div>
                </a>
            </div>`;
        }



    }

    //列出hotel清單

    const hotelList = html => {
        const hotellist = document.querySelector("#hotellist");
        hotellist.innerHTML = html;
    }

    const init = () => {
        hotelList(dataTotal
            .slice(offset, offset + PAGE_SIZE)
            .map(data => darea3Data(data))
            .join(''));

        //因為沒有filter所以分頁功能無效，要把他抽出來

        pglisthtml(pageCount(dataTotal.length));
    }

    init();





    



}


//特效

window.addEventListener("scroll", ani);

function ani(e) {
    const list = document.querySelectorAll(".list");
    let scrollHeight = window.scrollY;

    list.forEach((e, i) => {
        if (scrollHeight >= list[i].offsetTop - 600) {
            list[i].classList.add("in");
        } else {
            list[i].classList.remove("in");
        }
    })


}