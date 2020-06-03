//三小時


let data = new XMLHttpRequest();
data.open("get", "https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97", false);
data.send(null);
let dataTxt = JSON.parse(data.responseText);
let dataTotal = dataTxt.result.records;
console.log(dataTotal[0].Ticketinfo);

const seletZone = document.querySelector(".select select");
locationList();


//列出所有地區
function locationList() {

    let zone = [];
    let str = "";
    dataTotal.forEach((element, index) => {
        zone.push(dataTotal[index].Zone);
    });

    zone = zone.filter(function(element, index, arr) {
        return arr.indexOf(element) === index;
    });


    zone.forEach((element, index) => {
        str += "<option value='" + zone[index] + "'>" + zone[index] + "</option>";
    });
    // console.log(str);
    seletZone.innerHTML = str;
}







//排版用
document.querySelector(".list figure img").style.top = -90 + "px";