import { useState, useEffect, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";
import { School } from "../types";
import { TeacherCard } from "./Card";
import { Teacher } from "../types";

export function TeacherColumn({
  currentSchool,
  id,
}: {
  currentSchool: School;
  id: number;
}) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherName, setTeacherName] = useState("");
  const [currentTeachers, setCurrentTeachers] = useLocalStorage<Teacher[]>(
    id.toString(),
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

  const mapCards = useMemo(() => {
    return currentTeachers.map((teacher, key) => (
      <TeacherCard key={key} {...{ teacher, removeTeacher }} />
    ));
  }, [currentTeachers]);

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
        {mapCards}
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
