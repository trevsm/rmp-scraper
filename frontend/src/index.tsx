import { render } from "react-dom";
import { useLocalStorage } from "usehooks-ts";
import { SchoolColumn } from "./SchoolColumn";
import { TeacherColumn } from "./TeacherColumn";

export interface School {
  node?: {
    city: string;
    id: string;
    name: string;
    state: string;
  };
}

function App() {
  const [teacherColumns, setTeacherColumns] = useLocalStorage<string>(
    "teacherColumns",
    "1"
  );
  const [currentSchool, setCurrentSchool] = useLocalStorage<School>(
    "school",
    {}
  );

  return (
    <div>
      <label>
        Column Count:
        <input
          type="number"
          value={teacherColumns}
          min={1}
          max={10}
          onChange={(e) => setTeacherColumns(e.currentTarget.value)}
        />
      </label>
      <br />
      <br />
      <div style={{ display: "flex" }}>
        <SchoolColumn
          {...{
            currentSchool,
            setCurrentSchool,
          }}
        />
        {Array(parseInt(teacherColumns))
          .fill(null)
          .map((_, i) => (
            <TeacherColumn
              key={i}
              id={`teacherColumn${i + 1}`}
              {...{
                currentSchool,
              }}
            />
          ))}
      </div>
    </div>
  );
}

render(<App />, document.getElementById("root"));
