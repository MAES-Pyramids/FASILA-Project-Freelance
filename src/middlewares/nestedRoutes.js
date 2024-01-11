/**
 * @description middleware to Set Faculty University ID if not provided in the request body
 * @route /api/v1/Universities/:UniversityID/faculties
 */
exports.SetFacultyUniversityID = (req, res, next) => {
  if (!req.body.UniversityID) req.body.UniversityID = req.params.id;
  next();
};
