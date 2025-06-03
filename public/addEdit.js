import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showJobs } from "./jobs.js";

let addEditDiv = null;
let company = null;
let position = null;
let status = null;
let addingJob = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-job");
  company = document.getElementById("company");
  position = document.getElementById("position");
  status = document.getElementById("status");
  addingJob = document.getElementById("adding-job");
  const editCancel = document.getElementById("edit-cancel");

addEditDiv.addEventListener("click", async (e) => {
  if (inputEnabled && e.target.nodeName === "BUTTON") {
    if (e.target === addingJob) {
      enableInput(false);

      let method = "POST";
      let url = "/api/v1/jobs";
      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            company: company.value,
            position: position.value,
            status: status.value,
          }),
        });

        const data = await response.json();
        if (response.status === 201) {
          // 201 indicates a successful create
          message.textContent = "The job entry was created.";

          company.value = "";
          position.value = "";
          status.value = "pending";

          showJobs();
        } else {
          message.textContent = data.msg;
        }
      } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
      }

      enableInput(true);
    } else if (e.target === editCancel) {
      message.textContent = "";
      showJobs();
    }
  }
});
};

export const showAddEdit = (job) => {
  message.textContent = "";
  setDiv(addEditDiv);
};