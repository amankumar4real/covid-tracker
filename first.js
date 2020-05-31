var main_data

var curr_cou=""

var getto=[]

let pageData = []
let perPage = 25
let activePage = 1
let select



fetch("https://api.covid19api.com/summary")
.then(response=> response.json())
.then(res=>tot_stat(res))

function tot_stat(data){
    var len=data["Countries"].length

    var tot=0
    var dea=0
    var rec=0
    
    for(var i=0; i<len; i++){
        tot+=Number(data["Countries"][i]["TotalConfirmed"])
        dea+=Number(data["Countries"][i]["TotalDeaths"])
        rec+=Number(data["Countries"][i]["TotalRecovered"])
    }

    $("#tot").html(tot)
    $("#death").html(dea)
    $("#rec").html(rec)

    main_data=data
    getto=main_data["Countries"]

    pagination(activePage)
    // make_table()
}

function make_table(){
    console.log(pageData)
    var table=document.getElementById("app_here")
    table.innerHTML=""
    console.log(main_data)

    for(var i=0; i<pageData.length; i++){

        if(pageData[i]["Country"]==""){
            continue
        }

        var tr=document.createElement("tr")

        var th=document.createElement("th")
        th.innerHTML=`${(activePage-1)*perPage+i+1}`
        tr.appendChild(th)
        
        var td_a=document.createElement("td")
        td_a.innerHTML=pageData[i]['Country']
        tr.appendChild(td_a)

        var td_b=document.createElement("td")
        td_b.innerHTML=pageData[i]['TotalConfirmed']
        tr.appendChild(td_b)

        var td_c=document.createElement("td")
        td_c.innerHTML=pageData[i]['NewConfirmed']
        if(pageData[i]['NewConfirmed']!=0){
            
            td_c.setAttribute("class","bg-warning")
        }
        tr.appendChild(td_c)
        

        var td_d=document.createElement("td")
        td_d.innerHTML=pageData[i]['TotalDeaths']
        tr.appendChild(td_d)

        var td_e=document.createElement("td")
        td_e.innerHTML=pageData[i]['NewDeaths']
        if(pageData[i]['NewDeaths'] != 0){
            
            td_e.setAttribute("class","bg-danger")
        }
        tr.appendChild(td_e)

        var td_f=document.createElement("td")
        td_f.innerHTML=pageData[i]['TotalRecovered']
        tr.appendChild(td_f)

        var td_g=document.createElement("td")
        td_g.innerHTML=pageData[i]['NewRecovered']
        if(pageData[i]['NewRecovered']!=0){
            
            td_g.setAttribute("class","bg-success")
        }
        tr.appendChild(td_g)

        table.appendChild(tr)
    }

}

var form=document.querySelector("form")

form.addEventListener("submit",function(){
    event.preventDefault()
    var cont_name=$("#cou").val()

    search_by_cou(cont_name)
})

function search_by_cou(data){
    // console.log(main_data["Countries"][57]["Country"])
    let len= main_data["Countries"].length
    curr_cou=data

    for(var i=0; i<len; i++){
        if(main_data["Countries"][i]["Country"].toLowerCase()==data.toLowerCase()){
            new_data=main_data["Countries"][i]
            show(new_data)
        }
    }
}

function show(rev_data){
    $("#here").empty()
    $("#hidden").removeClass("vis")

    fetch(`https://restcountries.eu/rest/v2/name/${curr_cou}?fullText=true`)
    .then(response=>response.json())
    .then(res=>flag_data(res))

    function flag_data(flag){
        var flag_data=flag[0]["flag"]
        do_rest(flag_data)
    }

    function do_rest(lnk){

        $("body").removeClass("color_1")
        $("body").addClass("color_2")
        $("#flag").attr("src", lnk)


        $("#con_name").html(rev_data["Country"])

        $("#tc").html(rev_data["TotalConfirmed"])
        $("#nc").html(rev_data["NewConfirmed"])
        $("#td").html(rev_data["TotalDeaths"])
        $("#nd").html(rev_data["NewDeaths"])
        $("#tr").html(rev_data["TotalRecovered"])
        $("#nr").html(rev_data["NewRecovered"])

    }

    // console.log(getto)
}

var bck=document.getElementById("press_me")
bck.addEventListener("click",function(){
    window.location.href="index.html"
})


function pagination(page){
    let total = getto.length;
    let pageCOunt = Math.ceil(total/perPage) //100 div 25=4
    let pages = document.getElementById('pages') //navbar button selection
    pages.innerHTML = ""

    for(let i=0; i<pageCOunt; i++){
        let li = document.createElement('li')
        li.setAttribute('onclick',`changePage(${i+1})`)
        if(i === page-1){ // i==0 & activePage==1 so nav 1== active
            li.setAttribute('class', 'page-item active')
        }
        else{
            li.setAttribute('class', 'page-item')
        }
        let a = document.createElement('a')
        a.setAttribute('class', 'page-link')
        a.setAttribute('href', `#${i+1}`)
        a.textContent = i+1

        li.append(a)
        pages.append(li)
    }
    loadData()
}

function loadData(){
    //set the data according to page/home/aman/Downloads/paginationAlbert.html
    page = activePage
    let low = (page-1)*perPage
    let high = page*perPage
    pageData = getto.filter((a,i)=> i>=low && i<high)
    make_table(page)
}

function changePage(newPage){
    let liActive = document.querySelector(`#pages li:nth-child(${activePage})`)
    liActive.setAttribute('class', 'page-item')
    activePage = newPage
    let liNew =  document.querySelector(`#pages li:nth-child(${activePage})`)
    liNew.setAttribute('class', 'page-item active')
    loadData()
}