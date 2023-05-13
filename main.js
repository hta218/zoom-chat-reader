(function () {
  console.log("App running...");
  let dropTarget = document.getElementById("drop_target");
  let fileInput = document.getElementById("file_input");
  function readTextFile(event) {
    event.preventDefault();
    let file =
      event.type === "change"
        ? fileInput.files[0]
        : event.dataTransfer.files[0];
    let reader = new FileReader();
    reader.onload = () => {
      let text = reader.result;
      console.log(text);
    };
    reader.readAsText(file);
  }

  dropTarget.addEventListener("click", () => {
    fileInput.click();
  });

  dropTarget.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  dropTarget.addEventListener("drop", readTextFile);

  fileInput.addEventListener("change", readTextFile);
})();
