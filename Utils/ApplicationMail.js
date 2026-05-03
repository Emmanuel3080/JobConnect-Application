const sendMail = require("../ResendSetup/Resend");

const applicationMessage = async (name, email, job) => {
  const {
    title,
    company,
    location,
    jobType,
    salary,
    skills,
    remote,
    applicationDeadline,
  } = job;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Application Received</h2>

      <p>Dear <strong>${name}</strong>,</p>

      <p>
        Thank you for applying for the <strong>${title}</strong> position at
        <strong>${company}</strong>.
      </p>

      <h3 style="margin-top: 20px; color: #2c3e50;">Job Details</h3>

      <p>
        <strong>Company:</strong> ${company}<br/>
        <strong>Job Title:</strong> ${title}<br/>
        <strong>Location:</strong> ${location}${remote ? " (Remote available)" : ""}<br/>
        <strong>Job Type:</strong> ${jobType}<br/>
        <strong>Salary:</strong> ${salary || "Not disclosed"}<br/>
        <strong>Application Deadline:</strong> ${
          applicationDeadline
            ? new Date(applicationDeadline).toDateString()
            : "Not specified"
        }
      </p>

      <h3 style="margin-top: 20px; color: #2c3e50;">Skills Required</h3>
      <p>
        ${skills && skills.length > 0 ? skills.join(", ") : "Not specified"}
      </p>

      <p>
        We have successfully received your application and our recruitment team
        will review your profile carefully.
      </p>

      <p>
        If you are shortlisted, we will contact you with the next steps.
      </p>

      <p style="margin-top: 20px;">
        Best regards,<br/>
        <strong>${company} Recruitment Team</strong>
      </p>

      <hr />

      <p style="font-size: 12px; color: #777;">
        This is an automated message. Please do not reply directly to this email.
      </p>
    </div>
  `;

  try {
    const result = await sendMail({
      from: `${company} <onboarding@resend.dev>`,
      to: email,
      subject: `Application Received - ${title} at ${company}`,
      html: htmlContent,
    });

    return result;
  } catch (error) {
    console.error("Error sending application email:", error);
    throw error;
  }
};

module.exports = applicationMessage;