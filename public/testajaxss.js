var path = "https://www.gasbuddy.com/home?search="+encodeURIComponent("1650 Old York Rd, Allentown, NJ 08501, USA")+"&fuel=1";
//var path = "https://www.chooseenergy.com/shop/residential/electricity/NJ/08501/jersey-central-power-light-nj-electricity/"
//var path = 'http://maps.google.com/maps?q=MENYA%20SANDAIME%20JERSEY%20CITY%20NJ&iwd=1';
var homeAdd = sessionStorage.getItem("home_address");
var workAdd = sessionStorage.getItem("work_address");
var pathHome = "https://www.gasbuddy.com/home?search=" + encodeURIComponent(homeAdd) + "&fuel=1";
var pathWork = "https://www.gasbuddy.com/home?search=" + encodeURIComponent(workAdd) + "&fuel=1";
$.ajaxSetup({
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Authority" :  document.authorizationToken,
		"Api-Version" : "1.1",
		"Cobrand-Name": "restserver"
	}
});

$(document).ready(function(){

    console.log('here')

    var minPricep = {
        index: 0,
        price: 5,
        address: '',
        name: '',
    };

    var wminPricep = {
        index: 0,
        price: 5,
        address: '',
        name: '',
    };

    console.log('here');

    $.ajax({
        crossOrigin: true,
        url: pathHome,
        dataType: 'text',
        success: function(data) {
            console.log(typeof data);
            var priceStructs = $(data).find('.styles__price___3DxO5');
            var prices = [];
            for (var i = 0; i < priceStructs.length; i++) {
                prices.push(priceStructs[i].innerText);
                console.log(priceStructs[i].innerText.substring(1,5)+" vs "+minPricep.price);
                console.log(parseFloat(priceStructs[i].innerText.substring(1,priceStructs[i].innerText.length)));
                console.log(priceStructs[i].innerText!='---' && parseFloat(priceStructs[i].innerText.substring(1,priceStructs[i].innerText.length)) < minPricep.price);
                if (priceStructs[i].innerText!='---' && parseFloat(priceStructs[i].innerText.substring(1,priceStructs[i].innerText.length)) < minPricep.price) {
                    minPricep.index = i;
                    minPricep.price = parseFloat(priceStructs[i].innerText.substring(1,priceStructs[i].innerText.length)).toFixed(2);
                }
            }
            var addressesStructs = $(data).find('.styles__address___8IK98');
            minPricep.address = addressesStructs[minPricep.index].innerText.replace(/(\r\n\t|\n|\r\t)/gm," ");
            var addresses = [];
            for (var i = 0; i < addressesStructs.length; i++) {
                addresses.push(addressesStructs[i].innerText.replace(/(\r\n\t|\n|\r\t)/gm," "));
            }
            var namesStructs = $(data).find('.ui.header.styles__stationNameHeader___24lb3');
            minPricep.name = namesStructs[minPricep.index].innerText;
            var names = [];
            for (var i = 0; i < namesStructs.length; i++) {
                names.push(namesStructs[i].innerText);
            }
            console.log(prices);
            console.log(addresses);
            console.log(names);
            console.log(priceStructs);
            console.log($(data).find('.styles__price___3DxO5'));
            console.log(data);
            //var elements = $("<div>").html(data)[0];
            //console.log(elements);

            console.log("asdfasdfasdfasdf");
            console.log(minPricep);
            console.log(sessionStorage.setItem("minPricep", JSON.stringify(minPricep)));
        }
    });

    $.ajax({
        crossOrigin: true,
        url: pathWork,
        dataType: 'text',
        success: function(data) {
            console.log(typeof data);
            var priceStructs = $(data).find('.styles__price___3DxO5');
            var prices = [];
            for (var i = 0; i < priceStructs.length; i++) {
                prices.push(priceStructs[i].innerText);
                console.log(priceStructs[i].innerText.substring(1,5)+" vs "+wminPricep.price);
                console.log(parseFloat(priceStructs[i].innerText.substring(1,priceStructs[i].innerText.length)));
                console.log(priceStructs[i].innerText!='---' && parseFloat(priceStructs[i].innerText.substring(1,priceStructs[i].innerText.length)) < wminPricep.price);
                if (priceStructs[i].innerText!='---' && parseFloat(priceStructs[i].innerText.substring(1,priceStructs[i].innerText.length)) < wminPricep.price) {
                    wminPricep.index = i;
                    wminPricep.price = parseFloat(priceStructs[i].innerText.substring(1,priceStructs[i].innerText.length)).toFixed(2);
                }
            }
            var addressesStructs = $(data).find('.styles__address___8IK98');
            wminPricep.address = addressesStructs[wminPricep.index].innerText.replace(/(\r\n\t|\n|\r\t)/gm," ");
            var addresses = [];
            for (var i = 0; i < addressesStructs.length; i++) {
                addresses.push(addressesStructs[i].innerText.replace(/(\r\n\t|\n|\r\t)/gm," "));
            }
            var namesStructs = $(data).find('.ui.header.styles__stationNameHeader___24lb3');
            wminPricep.name = namesStructs[wminPricep.index].innerText;
            var names = [];
            for (var i = 0; i < namesStructs.length; i++) {
                names.push(namesStructs[i].innerText);
            }
            console.log(prices);
            console.log(addresses);
            console.log(names);
            console.log(priceStructs);
            console.log($(data).find('.styles__price___3DxO5'));
            console.log(data);
            //var elements = $("<div>").html(data)[0];
            //console.log(elements);

            console.log("asdfasdfasdfasdf");
            console.log(wminPricep);
            console.log(sessionStorage.setItem("wminPricep", JSON.stringify(wminPricep)));
        }
    });
        /*$.ajax({
        crossOrigin: true,
       url: path,
       dataType: 'text',
       headers: {
           'accept': 'application/json',
           'Access-Control-Allow-Origin': '*'
       },
       success: function(data) {
           console.log(typeof data);
           var priceStructs = $(data).find('.styles__price___3DxO5');
           var prices = [];
           for(var i = 0; i < priceStructs.length; i++){
               prices.push(priceStructs[i].innerText);
           }
           var addressesStructs = $(data).find('.styles__address___8IK98');
           var addresses = [];
           for(var i = 0; i < addressesStructs.length; i++){
               addresses.push(addressesStructs[i].innerText);
           }
           var namesStructs = $(data).find('.ui.header.styles__stationNameHeader___24lb3');
           var names = [];
           for(var i = 0; i < namesStructs.length; i++){
               names.push(namesStructs[i].innerText);
           }
           $('#test1').html(prices+"")
           $('#test2').html(addresses+"")
           $('#test3').html(names+"")
           console.log(prices);
           console.log(addresses);
           console.log(names);
           console.log(priceStructs);
           console.log($(data).find('.styles__price___3DxO5'));
           console.log(data);

            //var elements = $("<div>").html(data)[0];
            //console.log(elements);
           }
      });*/

});


/*
$(document).ready(function(){
       $.ajax({
       crossOrigin: true,
       url: path,
       dataType: 'text',
       success: function(data) {
           //console.log(typeof data);
           var priceStructs = $(data).find('.section-star-display');
           console.log(priceStructs);
           /*var prices = [];
           for(var i = 0; i < priceStructs.length; i++){
               prices.push(priceStructs[i].innerText);
           }
           console.log("AA"+prices);
           console.log(data);

            //var elements = $("<div>").html(data)[0];
            //console.log(elements);
           }
      });
});
*/
