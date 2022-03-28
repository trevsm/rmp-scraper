import { useEffect, useState } from "react";
import { School } from "./types";

export function SchoolColumn({
  currentSchool,
  setCurrentSchool,
}: {
  currentSchool: School;
  setCurrentSchool: (school: School) => void;
}) {
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolName, setSchoolName] = useState("");

  useEffect(() => {
    if (schoolName.length > 0) {
      const delaySearch = setTimeout(() => {
        fetch("http://localhost:4000/?school=" + schoolName)
          .then((res) => res.json())
          .then((data) => setSchools(data));
        return;
      }, 500);
      return () => clearTimeout(delaySearch);
    }
    setSchools([]);
  }, [schoolName]);

  useEffect(() => {
    setSchoolName("");
    setSchools([]);
  }, [currentSchool]);

  return (
    <div style={{ width: "300px" }}>
      <label>
        {" "}
        School Name:
        <br />
        <input
          type="text"
          value={schoolName}
          onChange={(e) => {
            setSchoolName(e.currentTarget.value);
          }}
        />
      </label>
      <br />
      <br />
      <div>
        Current School: <br />
        {currentSchool.node && (
          <div
            style={{
              width: "fit-content",
              border: "1px solid",
              padding: "5px",
              marginTop: "10px",
            }}
          >
            <span style={{ fontWeight: "bold" }}>
              {currentSchool.node?.name}
            </span>
            <br />
            <span style={{ opacity: 0.5 }}>
              {currentSchool?.node?.city}, {currentSchool?.node?.state}
            </span>
          </div>
        )}
      </div>
      <br />
      <ul>
        {schools.map(({ node }, key) => (
          <li
            key={key}
            style={{
              width: "fit-content",
              marginBottom: "20px",
              cursor: "pointer",
            }}
            onClick={() => setCurrentSchool({ node })}
          >
            <span style={{ fontWeight: "bold" }}>{node.name}</span>
            <br />
            <span style={{ opacity: 0.5 }}>
              {node.city}, {node.state}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
