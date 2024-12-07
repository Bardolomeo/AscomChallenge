import "react-calendar/dist/Calendar.css";
import { HandleFilterType } from "./PatientGrid";
import BirthDateCalendar from "./UI/BirthDateCalendar";
import SexCheckboxes from "./Checkboxes";

type FilterProps = {
  handleFilter: ({ which, e, dates: date }: HandleFilterType) => void;
  searchFamilyItem: string;
  searchGivenItem: string;
};

const FilterSection = ({
  handleFilter,
  searchFamilyItem,
  searchGivenItem,
}: FilterProps) => {
  return (
    <div className="pt-8">
      <h3 className="font-sans font-semibold pb-4 text-xl">Filters:</h3>
      <div className="flex gap-2 items-center">
        <input
          className="border-[1px] border-solid border-black focus:border-2"
          type="text"
          value={searchFamilyItem}
          onChange={(e) => handleFilter({ which: "family", e })}
          placeholder="Insert Family Name"
        />
        <input
          className="border-[1px] border-solid border-black focus:border-2"
          type="text"
          value={searchGivenItem}
          onChange={(e) => handleFilter({ which: "given", e })}
          placeholder="Insert Given Name"
        />
        <BirthDateCalendar handleFilter={handleFilter} />
        <SexCheckboxes handleFilter={handleFilter} />
      </div>
    </div>
  );
};

export default FilterSection;
