$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: "api/networth",
    dataType: "text",
    data: {
      top: 1
    },
    success: function(data){
      console.log(data);
      if (data != undefined){
        $("#balance").text(data);
      }
    }
  });


  $.ajax({
    type: "GET",
    url: "/api/getname",
    dataType : "text",
    success: function(name) {
      if (name != undefined) {
        $("#welcome").text("Welcome, " + name);
        $("#name").text(name + "!");
      }
    }
  });



});
