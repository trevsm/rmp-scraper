import { useState, useEffect, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";
import { School } from ".";

export interface Teacher {
  node?: {
    id: string;
    firstName: string;
    lastName: string;
    school: {
      name: string;
      id: string;
    };
    department: string;
    ratings?: {
      avgDifficulty: number;
      avgRating: number;
      numRatings: number;
      teacherRatingTags: [
        {
          tagCount: number;
          tagName: string;
        }
      ];
      wouldTakeAgainPercent: number;
    };
  };
}

export function TeacherColumn({
  currentSchool,
  id,
}: {
  currentSchool: School;
  id: string;
}) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherName, setTeacherName] = useState("");
  const [currentTeachers, setCurrentTeachers] = useLocalStorage<Teacher[]>(
    id,
    []
  );

  const addRatings = async (teacher: Teacher) => {
    const res = await fetch(
      "http://localhost:4000/?teacher_id=" + teacher.node?.id
    );
    const data = await res.json();
    return data;
  };

  const makeTar = async (prev: Teacher) => {
    const ratings = await addRatings(prev);
    return { node: { ...prev.node, ratings: ratings } };
  };

  useEffect(() => {
    if (!currentSchool.node) return;

    const delaySearch = setTimeout(() => {
      if (teacherName.length > 0) {
        fetch(
          "http://localhost:4000/?school_id=" +
            currentSchool.node?.id +
            "&teacher=" +
            teacherName
        )
          .then((res) => res.json())
          .then((data) => setTeachers(data));
        return;
      }
      setTeachers([]);
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [teacherName]);

  useEffect(() => {
    setTeacherName("");
    setTeachers([]);
  }, [currentTeachers]);

  const removeTeacher = (id: string) => {
    const newTeachers = currentTeachers.filter((t) => t.node?.id !== id);
    setCurrentTeachers(newTeachers);
  };

  const teacherList = useMemo(
    () =>
      currentTeachers.map(({ node: teacher }, key) => (
        <div
          key={key}
          style={{
            width: "fit-content",
            border: "1px solid",
            padding: "5px",
            marginTop: "10px",
          }}
        >
          {!currentTeachers.length ? (
            <>
              # <br />#
            </>
          ) : (
            <div>
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
                        ? Math.round(teacher.ratings?.wouldTakeAgainPercent) +
                          "%"
                        : "NA"}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )),
    [currentTeachers]
  );

  return (
    <div
      style={{
        marginRight: "20px",
        ...(!currentSchool ? { pointerEvents: "none", opacity: 0.5 } : {}),
      }}
    >
      <label>
        {" "}
        Teacher Name:
        <br />
        <input
          type="text"
          value={teacherName}
          onChange={(e) => {
            setTeacherName(e.currentTarget.value);
          }}
        />
      </label>
      <br />
      <br />
      <button onClick={() => setCurrentTeachers([])}>Clear</button>
      <div>
        Current Teachers: <br />
        {teacherList}
      </div>
      <br />
      <ul>
        {teachers.map(({ node }, key) => (
          <li
            key={key}
            style={{
              width: "fit-content",
              marginBottom: "20px",
              cursor: "pointer",
            }}
            onClick={() =>
              makeTar({ node }).then((data) =>
                setCurrentTeachers((prev) => [...prev, data])
              )
            }
          >
            <span style={{ fontWeight: "bold" }}>
              {node.firstName} {node.lastName}
            </span>
            <br />
            <span style={{ opacity: 0.5 }}>{node.department}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
