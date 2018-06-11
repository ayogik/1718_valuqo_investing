

function loadAccount(accountId, type, amount, container, name){

  $("#accountType").text(type);
  $("#accountName").text(name);
  if(container!="insurance"){
      $("#accountBalance").text(amount);
      }

  $("#accountContainer").text(container);
  $('#unlinkButtonDiv').data('accountId',accountId); //setter

  $('#emptyAccountDetailsDiv').addClass("hidden");
  $('#accountDetailsDiv').removeClass("hidden");

  $('#txnTable tbody').empty();
  $("#txnTable").append('<tbody><tr><td colspan="5" class="text-center"><div align="center" class="alert alert-info"><p>Loading Transactions....<i class="fa fa-spinner fa-spin" style="font-size:24px"></i></p></div></td></tr></tbody>');


  $.get( "/api/getTransactions", {"accountId" : accountId})
  .done(function( data ) {

    var responseObj = jQuery.parseJSON(data);
    window.console.log(responseObj);
    var trHTML = '';
         $.each(responseObj.transaction, function (i, item) {
            trHTML += '<tr><td>' + item.transactionDate + '</td><td class="text-right">' + item.amount.amount + '</td><td>' + item.category + '</td><td>' + item.description.simple + '</td><td>' + item.description.original + '</td></tr>';
        });

  //$('#txnTable tbody').empty();
  $('#txnTable tbody').remove();
  $("#txnTable").append('<tbody>'+trHTML+'</tbody>');

   });
}

function unlinkAccount(){

  window.console.log('unlink acct');
  var id =  $('#unlinkButtonDiv').data('accountId');

  $.get( "/YodleeSampleApp1.1/YodleeSampleApp",{ action: "deleteAccount", accountId:id} )
  .done(function( data ) {
    $('#unlinkAccountModal').modal('show')
   });

}

$(document).ready(function(){

	//Call sample appl servlet to get FastLink token.
	//Lauches FastLink by doing form POST in iFrame.

	$('#fastlinkbutton').click(function() {

	  $.get( "/YodleeSampleApp1.1/YodleeSampleApp",{ action: "getFastLinkToken"} )
	  .done(function( data ) {

		window.console.log('getFastLinkToken - '+data);
		var fastlinkTokensObj = jQuery.parseJSON(data);

		 $('#rsessionPost').attr('action', fastlinkTokensObj.nodeUrl);
		$("#rsession").val(fastlinkTokensObj.userSession);
		$("#token").val(fastlinkTokensObj.fastlinkToken);
		$('#extraParams').val(fastlinkTokensObj.dataset);
		//window.console.log('rsession from form: '+$("#rsession").val());

		document.getElementById('rsessionPost').submit();


	   });

	});

	//reload after fastlink close to trigger loading newly added accounts.
	$("#closeFastlink").click(function() {
		location.reload();
	});

	//Logout from Yodlee Sample Web App
	$("#logout").click(function() {
		window.location.href = "/YodleeSampleApp1.1/";
	});

	//reload after unlinking account to do fresh get accounts call.
	$('#unlinkAccountModal').on('hidden.bs.modal', function (e) {
		  location.reload();
	})

	//Load user accounts in Sample Web App
	$.get( "api/getAccounts")
	  .done(function( data ) {
      console.log(typeof(data));

		  $("#accountsListDiv").empty();

		  var accountsListHTML = "";

		  $.each(data.account, function (i, item) {
			  var paramsList=null;
			  if(item.CONTAINER!="insurance" && item.CONTAINER!="reward" ){
			  	 paramsList = "'"+item.id+"', '"+item.accountType+"', '"+item.balance.amount+"', '"+item.CONTAINER+"', '"+item.accountName+"'";
			  	}
			  	else {
			     paramsList = "'"+item.id+"', '"+item.accountType+"', '"+"null"+"', '"+item.CONTAINER+"', '"+item.accountName+"'";
			  	}


				accountsListHTML += '<div class="panel panel-default accnames"><div class="panel-heading"><a href="#" onClick="loadAccount('+paramsList+');backgroundColor(this);" ><strong>'+item.accountName+'</strong></a></div></div>';
	           });

		  $("#accountsListDiv").html(accountsListHTML);
	});

});

function backgroundColor(element){
  $('.panel-heading').removeClass('active');
  $(element).parent().addClass('active');
}

/*
$('#txnTable tbody').slimscroll({
    height: '160px',
    alwaysVisible: true,
    color: '#333'
})
*/
