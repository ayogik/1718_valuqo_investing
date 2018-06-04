$(document).ready(function(){

	//Initialize Yodlee Sample app - makes call to servlet to ensure cobrand login is successful.

	$.get( "/YodleeSampleApp1.1/YodleeSampleApp",{ action: "init"} )
	  .done(function( data ) {

		  data = data.replace(/\'/g, '\"');

		  var responseObj = jQuery.parseJSON(data);

		  if(responseObj && responseObj.cobSession){
			  $("#initCheck").append("<p><strong>Cobrand Configuration Check Successful!</strong></p><p>Use test accounts from API Dashboard to login</p>");

			  $('#submitButton').prop('disabled', false);

		  }else{

			  $("#initCheck").removeClass("alert-info");
			  $("#initCheck").addClass("alert-danger");

			  if(responseObj && responseObj.error){

				  $("#initCheck").append("<p>"+responseObj.message+"</p>");

			  }else{
				  $("#initCheck").append("<p>Error during initialization. Please check settings in config.properties and user credentials</p>");
			  }
		  }

	});

	//User login
	$('#submitButton').click(function() {

		window.console.log('submitButton');

			var userName = $("#username").val();
			var password = $("#password").val();
			$('#submitButton').prop('disabled', true);
			$('#submitButton').html("Loading...");

		  $.post( "/YodleeSampleApp1.1/YodleeSampleApp",{ username:userName, password:password} )
		  .done(function( data ) {

			  data = data.replace(/\'/g, '\"');
			  var dataObj = jQuery.parseJSON(data);

			  if(dataObj && dataObj.error && dataObj.error == "false"){
				  window.location.href="accounts.html";
			  }else{
				  $("#initCheck").removeClass("alert-info");
				  $("#initCheck").addClass("alert-danger");
				  $("#initCheck").append("<p>Error in User login, please check your test user credentials (from Yodlee API Dashboard).</p>");

				  $('#submitButton').prop('disabled', false);
				  $('#submitButton').html("Login");


			  }

		   });

	});


	$("#username").keyup(function(event){
	    if(event.keyCode == 13) {
	        $("#submitButton").click();
	    }
	});


	$("#password").keyup(function(event){
	    if(event.keyCode == 13) {
	        $("#submitButton").click();
	    }
	});


});
