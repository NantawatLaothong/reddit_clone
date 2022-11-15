var debounce = function (func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// const getMorePosts = (page)=>{
//     const posts 
//     $.get(`http://localhost:7098/apis/r/anime/${page}`, (post)=>{
        
//     })
// }

let page = 1

$('.loadMorePost').click(function(){
    console.log('clicked')
    // let div = document.createElement('DIV')
    $.get(`http://localhost:7098/apis/r/anime/${page}`, (posts)=>{
        console.log(posts)
    })
    page += 1
})

$('#search-input').keyup(debounce(function(){
    const term = $('#search-input').val();
    console.log(term);
    if(term == ''){
        $('.autocomplete-items').remove()
    }else{
        let autoCompleteItem;
        // const items = getSuggestion(term)
    
    
        $.get(`http://localhost:7098/apis/search/?term=${term}`, (data)=>{
            console.log(data)
            let div = document.createElement('DIV');
            div.setAttribute('id', 'autocomplete-list');
            div.setAttribute('class', 'autocomplete-items');
            $('#search-input').parent().append(div);
            for(i = 0; i < data.length; i++){
                autoCompleteItem = document.createElement('DIV');
                if(data[i].iconURL){
                    https://pbs.twimg.com/media/DBpNc2ZWsAA_Z71.jpg
                    // autoCompleteItem.innerHTML += "<a href='/r/manga' ><img src='https://pbs.twimg.com/media/DBpNc2ZWsAA_Z71.jpg'" +  "width='50' style='border-radius: 50%;'/>" + ' r/' + data[i].r + "</a>"
                    autoCompleteItem.innerHTML += "<img class='icon-image' src='" + data[i].iconURL.url + "'" +  "width='50px' style='border-radius: 50%'/>"
                } else {
                    autoCompleteItem.innerHTML += "<img class='icon-image' src='https://pbs.twimg.com/media/DBpNc2ZWsAA_Z71.jpg' width='50px' style='border-radius:50%'/>"
                }
                autoCompleteItem.innerHTML += " r/" + data[i].r
                autoCompleteItem.innerHTML += "<input type=hidden value='" + data[i].r + "'>";
                // closeAllLists();\
                let url = data[i].r
                autoCompleteItem.addEventListener('click', ()=>{
                    window.location.href = '/r/' + url;
                })
                div.append(autoCompleteItem)
                
                }
            }
        );
    }
    

}, 500));

// $('#search-input').focusout(()=>{
//     $('.autocomplete-items').remove()
// })

// $('#search-input').on('keydown', function(){
//     const term = $('#search-input').val();
//     let autoCompleteItem;
//     // const items = getSuggestion(term)

//     function closeAllList(elmt){
//         var x = document.getElementsByClassName("autocomplete-items");
//         for (var i = 0; i < x.length; i++) {
//           if (elmnt != x[i] && elmnt != inp) {
//           x[i].parentNode.removeChild(x[i]);
//         }
//     }
// }

//     $.get(`http://localhost:7098/apis/search/?term=${term}`, (data)=>{
//         console.log(data[1])
//         let div = document.createElement('DIV');
//         div.setAttribute('id', 'autocomplete-list');
//         div.setAttribute('class', 'autocomplete-items');
//         $('#search-input').parent().append(div);
//         for(i = 0; i < data.length; i++){
//             autoCompleteItem = document.createElement('DIV');
//             autoCompleteItem.innerHTML += data[i].r
//             autoCompleteItem.innerHTML += "<input type=hidden value='" + data[i].r + "'>";
//             // closeAllLists();\
//             div.append(autoCompleteItem)
//         }
       
//     })
    //
    // document.addEventListener("click", function (e) {
    //     closeAllLists(e.target);
    // });
    // add the div to the .autocomplete 
    // 
    
// });

