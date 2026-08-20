/**
 * Standard 500-response helper.
 *
 * Logs the FULL error (stack trace, Mongoose details, etc.) to the server
 * console for debugging, but sends only a short, plain-language message to
 * the client — never the raw err.message, which can contain technical
 * internals (e.g. "Cast to ObjectId failed for value \"undefined\"...").
 *
 * Usage in a controller catch block:
 *   catch (err) {
 *     sendServerError(res, err);
 *   }
 * Or with a route-specific fallback:
 *   catch (err) {
 *     sendServerError(res, err, 'Could not add this course.');
 *   }
 */
function sendServerError(res, err, fallback = 'Something went wrong on the server. Please try again.') {
  console.error(err);
  res.status(500).json({ message: fallback });
}

module.exports = sendServerError;
