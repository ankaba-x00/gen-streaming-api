export default function validateMovie(movie) {
  const titleRegex = /^[A-Za-z0-9\s&.,?!+*:'\-]+$/;
  const textRegex = /^[A-Za-z0-9\s&.,?!+/*:'\-]+$/;

  if (!movie?.title || movie?.title.trim() === "" || movie?.title.length >= 100 || !titleRegex.test(movie?.title.trim())) {
    return `
      Invalid title.
      Allowed: A-Z a-z 0-9 & . , ? ! + - ' [space]
    `;
  }

  if (!movie?.year || !/^\d{4}$/.test(movie?.year) || movie?.year < 1888 || movie?.year > 2999) {
    return `
      Please enter a valid 4-digit release year (e.g. 2025). 
      Range: 1888 - 2999
    `;
  }

  if (!movie?.duration || movie?.duration > 900) {
    return `
      Please enter a valid media duration in min.
      Range: 1 - 900 min
    `;
  }

  if (
    !movie?.limit ||
    movie?.limit.trim() === "" ||
    !["U","PG","6+","9+","11+","12+","14+","15+","16+","18+","19+"].includes(movie?.limit)
  ) {
    return `
      Please enter an age restriction. 
      Valid limits: U, PG, 6+, 9+, 12+, 14+, 15+, 16+, 18+, 19+
    `;
  }

  if (movie?.isSeries === "" || movie?.isSeries === undefined || movie?.isSeries === null) {
    return "Please select a media type.";
  }

  if (!movie?.trailer || !movie?.video || !movie?.imgSm || !movie?.img) {
    return `
      Please upload ALL required files:
      1) Trailer
      2) Video
      3) Thumbnail Image
      4) Feature Image
    `;
  }

  if (
    !movie?.imgSmText ||
    movie?.imgSmText.length < 25 ||
    movie?.imgSmText.length > 250 ||
    !textRegex.test(movie?.imgSmText.trim())
  ) {
    return `
      Invalid thumbnail description.
      Length: 25 - 250 characters
      Allowed: A-Z a-z 0-9 & . , ? ! + - / * ' [space]
    `;
  }

  if (
    !movie?.imgText ||
    movie?.imgText.length < 25 ||
    movie?.imgText.length > 450 ||
    !titleRegex.test(movie?.imgText.trim())
  ) {
    return `
      Invalid feature description.
      Length: 25 - 450 characters
      Allowed: A-Z a-z 0-9 & . , ? ! + - / * ' [space]
    `;
  }

  if (!movie?.genre || movie?.genre.length === 0) {
    return "Please select at least one genre.";
  }

  return null;
}
