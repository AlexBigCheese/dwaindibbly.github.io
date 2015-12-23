$("a.button").addClass("buttonru");
$("a.buttonf").addClass("buttonfu");
$("a.button").mouseenter(function () {
  $(this).removeClass("buttonru");
  $(this).addClass("buttonrf");
});
$("a.button").mouseleave(function () {
  $(this).removeClass("buttonrf");
  $(this).addClass("buttonru");
});
$("a.button").mousedown(function () {
  $(this).removeClass("buttonrf");
  $(this).addClass("buttonrd");
})
$("a.button").mouseup(function () {
  
})
$("a.buttonf").mouseenter(function () {
  $(this).removeClass("buttonfu");
  $(this).addClass("buttonff");
})
$("a.buttonf").mouseleave(function () {
  $(this).removeClass("buttonff");
  $(this).addClass("buttonfu");
})
$("a.buttonf").mousedown(function () {
  $(this).removeClass("buttonff");
  $(this).addClass("buttonfd");
})
$("a.buttonf").mouseup(function () {
  $(this).removeClass("buttonfd").addClass("buttonff")
})