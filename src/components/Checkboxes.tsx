import { useEffect, useState } from "react";
import { handleFilterType } from "./PatientGrid";

const Checkboxes = ({
  handleFilter,
}: {
  handleFilter: ({ which }: handleFilterType) => void;
}) => {
  const [isCheckedMale, setIsCheckedMale] = useState(true);
  const [isCheckedFemale, setIsCheckedFemale] = useState(true);
  const [isCheckedAlarm, setIsCheckedAlarm] = useState(true);


  useEffect(() => {
    let sex : "M" | "F" | "MF" = "MF";

    if (!isCheckedMale)
      sex = "F";
    if (!isCheckedFemale)
      sex = "M";
    if ((!isCheckedFemale && !isCheckedMale) || (isCheckedFemale && isCheckedMale))
      sex = "MF";
    handleFilter({which: 'sex', sex })
  }, [isCheckedMale, isCheckedFemale])

  useEffect(() => {
    handleFilter({which: 'alarm', alarm: isCheckedAlarm});
  }, [isCheckedAlarm])

  return (
    <div className="flex gap-2">
      <label>
        {"M\xa0"}
        <input
          type="checkbox"
          id="male"
          value={""}
          checked={isCheckedMale}
          onChange={() => setIsCheckedMale(!isCheckedMale)}
        />
      </label>
      <label>
        {"F\xa0"}
        <input
          type="checkbox"
          id="female"
          value={""}
          checked={isCheckedFemale}
          onChange={() => setIsCheckedFemale(!isCheckedFemale)}
        />
      </label>
      <label className="pl-4">
        {"Alarm?\xa0"}
        <input
          type="checkbox"
          id="alarm"
          value={"alarm"}
          checked={isCheckedAlarm}
          onChange={() => setIsCheckedAlarm(!isCheckedAlarm)}
        />
      </label>
    </div>
  );
};

export default Checkboxes;
