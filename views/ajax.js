class Ajax {
  constructor() {}

  ajaxApiGet(vegpont, callback) {
    $.ajax({
      url: vegpont,
      method: "GET",
      success: function (eredmeny) {
        callback(eredmeny);
      },
    });
  }

  

  ajaxApiPost(vegpont, obj, callback) {
    $.ajax({
      url: vegpont,
      method: "POST",
      data: obj,
      success: function () {
        callback();
      },
    });
  }

  ajaxApiPut(vegpont, obj, callback) {
    $.ajax({
      url: vegpont,
      method: "PUT",
      data: obj,
      success: function () {
        callback();
      },
    });
  }

  ajaxApiDelete(vegpont, id, callback) {
    $.ajax({
      url: vegpont + "/" + id,
      method: "DELETE",

      success: function () {
        callback();
      },
    });
  }
}
