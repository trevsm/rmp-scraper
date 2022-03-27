import { searchTeachers, getTeacherRatings, searchSchools } from "./api";

var express = require("express");
var app = express();

app.get("/", async function (req, res) {
  const { teacher, school, school_id, teacher_id } = req.query;

  // get teacher ratings based on school id
  if (teacher_id) {
    console.log("Query >>> teacher id:", teacher_id);
    const teacherRatings = await getTeacherRatings(teacher_id);
    res.send(teacherRatings);
    return;
  }

  //  get all teachers by name within a school id
  if (teacher && school_id) {
    console.log("Query >>> teacher & school_id:", teacher, school_id);
    const teachers = await searchTeachers(teacher, school_id);
    res.send(teachers);
    return;
  }

  // need more info
  if (school_id || teacher) {
    res.send("Need more info.");
    return;
  }

  // get all schools by name
  if (school) {
    console.log("Query >>> school:", school);
    const schools = await searchSchools(school);
    res.send(schools);
    return;
  }

  res.send("Acceptable query params: school, teacher, school_id, teacher_id");
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
