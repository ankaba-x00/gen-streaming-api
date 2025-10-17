export default function validateList(list, movies) {
  const titleRegex = /^[A-Za-z0-9\s]+$/;

  if (!list?.title || list?.title.trim() === "" || list?.title.length >= 100 || !titleRegex.test(list?.title.trim())) {
    return `
      Invalid title.
      Allowed: A-Z a-z 0-9 [space]
    `;
  }

  if (!list?.type || !["movie", "series"].includes(list?.type)) {
    return "Please enter a valid media type.";
  }

  if (!list?.genre || list?.genre.length === 0) {
    return "Please select at least one genre.";
  }

  if (!list?.content || list?.content.length < 10) {
    return `
      Not enough list items selected.
      Minimum: 10 items
    `
  }

  const hasTypeMismatch = list?.content.some(id => {
    const isSeries = movies.get(id);
    if (!isSeries && list?.type === "series") return true;
    if (isSeries && list?.type === "movie") return true;
    return false;
  });

  if (hasTypeMismatch) {
    return `
      Type mismatch error.
      List type must match all content item types.
    `;
  }

  return null;
}
