// A small found-document flavor message for anyone curious enough to open the console.

(function () {
  const line1 = "color:#d9953d;font-family:monospace;font-size:13px;";
  const line2 = "color:#7c8478;font-family:monospace;font-size:12px;";

  console.log("%c[ ACCESS LOG — B-01 ]", line1);
  console.log(
    "%cЗапись найдена в системном журнале. Дата повреждена.\nПоследняя строка читается:\n\"...если это кто-то читает — значит, свет всё ещё горит.\"",
    line2
  );
})();
