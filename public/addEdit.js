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
    if (!inputEnabled || e.target.nodeName !== "BUTTON") return;

    if (e.target === addingJob) {
      enableInput(false);

      let method = "POST";
      let url = "/api/v1/jobs";

      if (addingJob.textContent === "update") {
        method = "PATCH";
        url = `/api/v1/jobs/${addEditDiv.dataset.id}`;
      }

      try {
        const response = await fetch(url, {
          method,
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
        if (response.status === 201 || response.status === 200) {
          message.textContent =
            response.status === 201
              ? "The job entry was created."
              : "The job entry was updated.";

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
  });
};

export const showAddEdit = async (jobId) => {
  if (!jobId) {
    company.value = "";
    position.value = "";
    status.value = "pending";
    addingJob.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/jobs/${jobId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        company.value = data.job.company;
        position.value = data.job.position;
        status.value = data.job.status;
        addingJob.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = jobId;

        setDiv(addEditDiv);
      } else {
        message.textContent = "The job entry was not found";
        showJobs();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communication error has occurred.";
      showJobs();
    }

    enableInput(true);
  }
};

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("deleteButton")) {
    const jobId = e.target.dataset.id;
    if (!jobId) return;

    enableInput(false);

    try {
      const response = await fetch(`/api/v1/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        message.textContent = "The job entry was deleted.";
        showJobs();
      } else {
        const data = await response.json();
        message.textContent = data.msg || "Failed to delete the job.";
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communication error occurred during deletion.";
    }

    enableInput(true);
  }
});
