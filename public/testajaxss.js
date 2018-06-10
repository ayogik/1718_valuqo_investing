//var path = "https://www.gasbuddy.com/home?search="+encodeURIComponent("1650 Old York Rd, Allentown, NJ 08501, USA")+"&fuel=1";
var path = "https://www.chooseenergy.com/shop/residential/electricity/NJ/08501/jersey-central-power-light-nj-electricity/"
/*
$.ajaxSetup({
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Authority" :  document.authorizationToken,
		"Api-Version" : "1.1",
		"Cobrand-Name": "restserver"
	}
});

$(document).ready(function(){
        $.ajax({
        crossOrigin: true,
       url: path,
       dataType: 'text',
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
      });
});*/


$(document).ready(function(){
        $.ajax({
        crossOrigin: true,
       url: path,
       dataType: 'text',
       success: function(data) {
           console.log(typeof data);
           var priceStructs = $(data).find('.ng-binding');
           var prices = [];
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
