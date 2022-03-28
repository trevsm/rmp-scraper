import { render } from "react-dom";
import { useLocalStorage } from "usehooks-ts";
import { SchoolColumn } from "./SchoolColumn";
import { TeacherColumn } from "./Teacher/TeacherColumn";
import { School } from "./types";

const D = ({
  num,
  element,
}: {
  num: number;
  element: (idx: number) => any;
}) => {
  return (
    <>
      {Array(num)
        .fill(null)
        .map((_, idx: number) => element(idx))}
    </>
  );
};

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
        <D
          num={parseInt(teacherColumns)}
          element={(idx) => (
            <TeacherColumn key={idx} id={idx} {...{ currentSchool }} />
          )}
        />
      </div>
    </div>
  );
}

render(<App />, document.getElementById("root"));
