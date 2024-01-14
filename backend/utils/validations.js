const Joi = require("joi");

function validateUser(user) {
  const userSchema = Joi.object({
    name: Joi.string().max(100).required(),
    userName: Joi.string().max(100).required(),
    email: Joi.string().max(100).required(),
    password: Joi.string().max(500).required(),
    role: Joi.number().integer().required(),
  });
  return userSchema.validate(user);
}
function validateUserAuth(user) {
  const userAuthSchema = Joi.object({
    email: Joi.string().max(100).required(),
    password: Joi.string().max(50).required(),
  });

  return userAuthSchema.validate(user);
}
function validateCourse(course) {
  const courseSchema = Joi.object({
    number: Joi.number().integer().required(),
    name: Joi.string().max(100).required(),
    description: Joi.string().max(500).allow(null).default(null),
    credit: Joi.number().integer().required(),
    hoursPerWeek: Joi.number().integer().allow(null).default(null),
    institute: Joi.number().integer().required(),
    faculty: Joi.string().max(100).allow(null).default(null),
    tags: Joi.string().max(100).allow(null).default(null),
  });
  return courseSchema.validate(course);
}
function validateCourseReview(courseReview) {
  const courseReviewSchema = Joi.object({
    course_id: Joi.number().integer().required(),
    author: Joi.string().max(100).required(),
    comment: Joi.string().max(500).allow(null).default(null),
    structureReview: Joi.number().integer().allow(null).default(null),
    contentReview: Joi.number().integer().allow(null).default(null),
    difficultyReview: Joi.number().integer().allow(null).default(null),
    relevanceReview: Joi.number().integer().allow(null).default(null),
  });
  return courseReviewSchema.validate(courseReview);
}
function validateCourseReport(courseReport) {
  const courseReportSchema = Joi.object({
    course_id: Joi.number().integer().required(),
    reason: Joi.string().max(100).required(),
    details: Joi.string().max(500).allow(null).default(null),
  });
  return courseReportSchema.validate(courseReport);
}

function validateProfessor(professor) {
  const professorSchema = Joi.object({
    name: Joi.string().max(100).required(),
    institute: Joi.number().integer().required(),
    faculty: Joi.string().max(100).allow(null).default(null),
    tags: Joi.string().max(100).allow(null).default(null),
  });
  return professorSchema.validate(professor);
}
function validateProfessorReview(professorReview) {
  const professorReviewSchema = Joi.object({
    professor_id: Joi.number().integer().required(),
    author: Joi.string().max(100).required(),
    comment: Joi.string().max(500).allow(null).default(null),
    interpersonalRelationshipsReview: Joi.number()
      .integer()
      .allow(null)
      .default(null),
    proficiencyReview: Joi.number().integer().allow(null).default(null),
    teachingMethodReview: Joi.number().integer().allow(null).default(null),
  });
  return professorReviewSchema.validate(professorReview);
}
function validateProfessorReport(professorReport) {
  const professorReportSchema = Joi.object({
    professor_id: Joi.number().integer().required(),
    reason: Joi.string().max(100).required(),
    details: Joi.string().max(500).allow(null).default(null),
  });
  return professorReportSchema.validate(professorReport);
}

const validateCourseProfessorRelation = (courseProfessorRelation) => {
  const schema = Joi.object({
    id: Joi.number().integer(),
    course_id: Joi.number().integer().required(),
    professor_id: Joi.number().integer().required(),
  });

  return schema.validate(courseProfessorRelation);
};
module.exports = {
  validateUser,
  validateUserAuth,
  validateCourse,
  validateCourseReview,
  validateCourseReport,
  validateProfessor,
  validateProfessorReview,
  validateProfessorReport,
  validateCourseProfessorRelation,
};
