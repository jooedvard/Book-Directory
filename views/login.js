$(() => {
  const username = $("#login");
  const password = $("#password");
  let user = " ";
  let pass = " ";
  let obj = { user: "", pass: "" };

  username.on("input", (event) => {
    let { value } = event.target;
    user = value;
    obj.user = user;
  });

  password.on("input", (event) => {
    let { value } = event.target;
    pass = value;
    obj.pass = pass;
  });

  $(".button").on("click", (event) => {
    event.preventDefault();
    console.log(obj);
    $.ajax({
      url: "/login",
      method: "POST",
      data: obj,

      success: function (data, textStatus, jqXHR) {
        console.log(data, textStatus, jqXHR);
        if (typeof data.redirect == "string"){
          window.location = data.redirect;
         
        } 
      },
    });
  });
});
