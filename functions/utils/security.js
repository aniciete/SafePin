const SANITIZE_REGEX = /<[^>]*>/g;

function sanitize(input) {
  return input.replace(SANITIZE_REGEX, '');
}

module.exports = { sanitize };