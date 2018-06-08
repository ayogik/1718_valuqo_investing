const path = "https://www.valuqo.us";
/*
$.ajaxSetup({
	headers: {
		"Access-Control-Allow-Origin": "*",
		"Authority" :  document.authorizationToken,
		"Api-Version" : "1.1",
		"Cobrand-Name": "restserver"
	}
});
*/
$(document).ready(function(){
	/*
	$("#initCheck").removeClass("alert-info");
	$("#initCheck").addClass("alert-warning");
	//Initialize Yodlee Sample app - makes call to servlet to ensure cobrand login is successful.
	$.post( path + "cobrand/login",{
		cobrandParam:
		{
			'cobrand': {
				"cobrandLogin": "sbCobdbf3615a663fa406a1fbef6009fe38075a",
				"cobrandPassword": "de178e45-9aff-4c88-a59b-4518c0ff6ce1",
				"locale": "en_US" //for now yea
			}
		}
	})
	*/
	$.ajax({
	  type: "GET",
		url: path + "/api/cobrandlogin",
	  success: function(responseObj) {
		  if(responseObj && responseObj.session.cobSession){
				$("#initCheck").removeClass("alert-info");
			  $("#initCheck").addClass("alert-success");
				$(".temp").remove();
			  $("#initCheck").append("<p class='temp'>Connection Successful!</p><p class='temp'><strong>VALUQO IS CURRENTLY USING TEST API:</strong> Log in with default logins.</p>");

			  $('#submitButton').removeClass('disabled');
		  }else{

			  $("#initCheck").removeClass("alert-info");
			  $("#initCheck").addClass("alert-danger");

			  if(responseObj && responseObj.error){

				  $("#initCheck").append("<p>"+responseObj.message+"</p>");

			  }else{
				  $("#initCheck").append("<p>Error during initialization. Please check settings in config.properties and user credentials</p>");
			  }
		  }
	  }
	});

	//User login
	$('#submitButton').click(function() {
		//window.console.log('submitButton');

			var userName = $("#exampleInputEmail1").val();
			var password = $("#exampleInputPassword1").val();
			$('#submitButton').prop('disabled', true);
			$('#submitButton').html("Loading...");
			console.log("user is " +userName);

			$.ajax({
			  type: "POST",
				url: path + "/api/userlogin",
				contentType: "application/json",
				processData: false,
				data: JSON.stringify({
					"username": userName,
					"password": password
				}),
				dataType: "text",
			  success: function(data) {
					if (data != "error"){
						location.href = "/index";
					}
				},
				error: function(um, uh, yeah) {
					$("#initCheck").removeClass("alert-info");
					$("#initCheck").addClass("alert-danger");
					$(".temp").remove();
					$("#initCheck").append("<p class='temp'>dunno something broke ¯\\_(ツ)_/¯</p>");

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
