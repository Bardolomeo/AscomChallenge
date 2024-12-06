import Calendar from "react-calendar";
import { handleFilterType } from "../PatientGrid";
import { useState } from "react";

type BirthDateCalendarProps = {
  handleFilter: ({ which, e, date }: handleFilterType) => void;
};

const BirthDateCalendar = ({handleFilter}: BirthDateCalendarProps) => {

  const [visibleCalendar, setVisibleCalendar] = useState(false);
  const buttonCN = "rounded-full border-[1px] border-solid border-black px-3 py-1 w-32 shadow-lg hover:bg-[#E0E0E0] font-semibold bg-[#AD9494]";
  
  const defaultDates = [new Date(" Jan 01 0100 00:00:00 GMT+0100 (Central European Standard Time)"), new Date("Thu Jan 01 2125 00:00:00 GMT+0100 (Central European Standard Time)")]

  return (
    <div className="flex flex-col">
      <div className={`absolute ${!visibleCalendar && " hidden "} bottom-40`}>
        <div
          className="flex justify-between items-center bg-white border-[1px] border-solid border-gray-500
		  border-b-0"
        >
          <h3 className="p-4 text-lg">Select a range</h3>
          <div className="pr-2">
            <button
              className="underline"
              onClick={() => {
                handleFilter({ which: "birthDate", date: defaultDates }),
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
            handleFilter({ which: "birthDate", date }),
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
