import Calendar from "react-calendar";
import { HandleFilterType } from "../PatientGrid";
import { useState } from "react";

type BirthDateCalendarProps = {
  handleFilter: ({ which, e, dates: date }: HandleFilterType) => void;
};

const BirthDateCalendar = ({ handleFilter }: BirthDateCalendarProps) => {
  const [visibleCalendar, setVisibleCalendar] = useState(false);
  const buttonCN =
    "rounded-full border-2 border-solid border-[#497faa] px-3 py-1 w-32 shadow-lg hover:bg-[#9db6cd] hover:border-[#9db6cd] hover:text-white font-semibold bg-[#white] text-[#497faa]";

  const defaultDates = [
    new Date(" Jan 01 0100 00:00:00 GMT+0100 (Central European Standard Time)"),
    new Date(
      "Thu Jan 01 2125 00:00:00 GMT+0100 (Central European Standard Time)"
    ),
  ];

  return (
    <div className="flex flex-col">
      <div className={`absolute ${!visibleCalendar && " hidden "} bottom-28`}>
        <div
          className="flex justify-between items-center bg-white border-[1px] border-solid border-gray-500
		  border-b-0"
        >
          <h3 className="p-4 text-lg">Select a range</h3>
          <div className="pr-2">
            <button
              className="underline"
              onClick={() => {
                handleFilter({ which: "birthDate", dates: defaultDates }),
                  setVisibleCalendar(false);
              }}
            >
              Clear Dates
            </button>
          </div>
        </div>
        <Calendar
          selectRange={true}
          onChange={(date) => {
            handleFilter({ which: "birthDate", dates: date }),
              setVisibleCalendar(false);
          }}
        />
      </div>
      <button
        onClick={() => setVisibleCalendar(!visibleCalendar)}
        className={buttonCN}
      >
        Birth Date
      </button>
    </div>
  );
};

export default BirthDateCalendar;
