export default function validateUser(user, { mode = "create" } = {} ) {
  const isCreate = mode === "create";

  const nameRegex = /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/;
  const usernameRegex = /^[A-Za-z0-9_-]+$/;
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
  const phoneRegex = /^\+[0-9]+$/;

  /* REQUIRED FILEDS */

  if (
    (isCreate && !user?.username) ||
    (user?.username && !usernameRegex.test(user.username))
  ) {
    return `
      Please enter a valid username. 
      Allowed: letters, numbers, spaces, and _ or -
    `;
  }

  if (
    (isCreate && !user?.email) ||
    (user?.email && !emailRegex.test(user.email))
  ) {
    return `
      Please enter a valid email address.
      Allowed: letters, numbers, dot, underscore, percent, plus and hyphen before @; 2 or more letters for TLD 
    `;
  }

  if (
    (isCreate && !user?.password) ||
    (user?.password && !passwordRegex.test(user.password))
  ) {
    return `
      Please enter a valid password. 
      Required: one uppercase letter, one lowercase letter, one number, and one special character
    `;
  }

  /* OPTIONAL FIELDS */

  if (user?.name && !nameRegex.test(user.name.trim())) {
    return `
      Please enter a valid full name.
      Length: 2 or more words
      Allowed: A-Z a-z [space]
    `;
  }
  
  if (user?.phone && !phoneRegex.test(user.phone)) {
    return `
      Please enter a valid phone number:
      Required: + followed by numbers
    `;
  }

  if (user?.country && user.country.trim() === "") {
    return "Please select your country of residence.";
  }

  return null;
}
