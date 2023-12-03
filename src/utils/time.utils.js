const dateToISO8601Format = (date) => {
  const isoString = date.toISOString(); // Get the date in ISO 8601 format

  // Extract the date and time components
  const datePart = isoString.split("T")[0];
  const timePart = isoString.split("T")[1].split(".")[0]; // Remove milliseconds

  // Get the time zone offset
  const offsetMinutes = date.getTimezoneOffset(); // Get the offset in minutes
  const offsetHours = Math.abs(offsetMinutes / 60); // Convert minutes to hours
  const offsetSign = offsetMinutes < 0 ? "+" : "-"; // Determine the sign of the offset

  // Format the offset in HH:mm format
  const offsetFormatted = `${offsetSign}${String(offsetHours).padStart(
    2,
    "0"
  )}:${String(Math.abs(offsetMinutes % 60)).padStart(2, "0")}`;

  // Construct the final date string in the required format
  const formattedDate = `${datePart}T${timePart}${offsetFormatted}`;
  return formattedDate;
};

export { dateToISO8601Format };
