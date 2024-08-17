(function () {
  console.log("App running...");
  let dropTarget = document.getElementById("drop_target");
  let content = document.getElementById("content");
  let fileInput = document.getElementById("file_input");
  let fileName = document.getElementById("file_name");
  let tableBody = document.getElementById("table_body");
  let copyButton = document.getElementById("copy_button");

  function readTextFile(event) {
    event.preventDefault();
    let file =
      event.type === "change"
        ? fileInput.files[0]
        : event.dataTransfer.files[0];
    fileName.textContent = file.name;
    let reader = new FileReader();
    reader.onload = () => {
      content.classList.remove("hidden");
      let text = reader.result;
      let lines = text.split("\n");
      let time = "";
      let from = "";
      let message = "";
      let index = 1;
      lines.forEach((line) => {
        line = line.replace(/[\t\r]/g, " ").trim();
        if (line.match(/^\d{2}:\d{2}:\d{2}/)) {
          time = line.slice(0, 8);
          from = line
            .replace(time, "")
            .replace(/to  Everyone:/, "")
            .replace(/From/, "")
            .trim();
          message = "";
        } else {
          message += line + " ";
        }
        if (time && message && message.length > 5) {
          let phoneNumber = getPhoneNumber(message);
          let isExisted = document.querySelector(`[data-phone-number="${phoneNumber}"]`)
          if (!isExisted) {
            let address = message.replace(phoneNumber, "");
            let row = document.createElement("tr");
            row.innerHTML = `
          		<td class="border px-6 py-2">${index}</td>
          		<td class="border px-6 py-2">${time}</td>
          		<td class="border px-6 py-2">${from}</td>
          		<td class="border px-6 py-2">${address}</td>
          		<td class="border px-6 py-2" data-phone-number="${phoneNumber}">${phoneNumber}</td>
          	`;
            tableBody.appendChild(row);
            from = "";
            index++;
          }
        }
      });
    };
    reader.readAsText(file);
  }

  function getPhoneNumber(text) {
    let phoneNumber = text.match(/\d{10}/g);
    if (!phoneNumber) {
      phoneNumber = text.match(/^(\d{3})\D*(\d{4})$/g);
    }
    return phoneNumber?.trim() || "N/A";
  }

  copyButton.addEventListener("click", () => {
    copyButton.innerText = "Copied!";
    copyButton.classList.add("cursor-not-allowed", "opacity-50");
    setTimeout(() => {
      copyButton.innerText = "Copy 🗒️";
      copyButton.classList.remove("cursor-not-allowed", "opacity-50");
    }, 2000);

    let tableRows = [...tableBody.childNodes].map((row) =>
      row.innerText.trim()
    );
    let tableString = tableRows.join("\n");
    navigator.clipboard.writeText(tableString);
  });

  dropTarget.addEventListener("click", () => {
    fileInput.click();
  });

  dropTarget.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropTarget.classList.add("bg-gray-200");
  });

  dropTarget.addEventListener("dragleave", () => {
    dropTarget.classList.remove("bg-gray-200");
  });

  dropTarget.addEventListener("drop", readTextFile);

  fileInput.addEventListener("change", readTextFile);
})();
