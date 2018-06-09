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
