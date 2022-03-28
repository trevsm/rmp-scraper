import { Teacher } from "../types";

export function TeacherCard({
  teacher: { node: teacher },
  removeTeacher,
}: {
  teacher: Teacher;
  removeTeacher: (id: string) => void;
}) {
  console.log(teacher);

  return (
    <div
      style={{
        width: "fit-content",
        border: "1px solid",
        padding: "5px",
        marginTop: "10px",
      }}
    >
      <div>
        <span style={{ fontWeight: "bold" }}>
          {teacher.firstName} {teacher.lastName}
        </span>
        <button
          style={{ float: "right" }}
          onClick={() => removeTeacher(teacher.id)}
        >
          x
        </button>
        <br />
        <span style={{ opacity: 0.5 }}>{teacher.department}</span>
        <br />
        <hr />
        {teacher.ratings.numRatings == 0 ? (
          <span>No ratings...</span>
        ) : (
          <>
            <span>Sample Size: {teacher.ratings.numRatings}</span>
            <br />
            <span>Rating: {teacher.ratings?.avgRating} / 5</span>
            <br />
            <span>Difficult: {teacher.ratings?.avgDifficulty} / 5</span>
            <br />
            <span>
              Would take again:{" "}
              {teacher.ratings.wouldTakeAgainPercent !== -1
                ? Math.round(teacher.ratings?.wouldTakeAgainPercent) + "%"
                : "NA"}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
