$(document).ready(() => {
  var logout_btn = $("#logout");
  if (logout_btn) {
    logout_btn.click(() => {
      console.log("here");
      $("#logout-form").submit();
    });
  }
});
