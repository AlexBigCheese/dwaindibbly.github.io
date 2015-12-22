$("a.button").addClass("buttonru");
$("a.button").mouseenter(function () {
  $(this).removeClass("buttonru");
  $(this).addClass("buttonrf");
});
$("a.button").mouseleave(function () {
  $(this).removeClass("buttonrf");
  $(this).addClass("buttonru");
});