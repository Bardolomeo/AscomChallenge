import axios from "axios";
import { useEffect, useState } from "react";
import SortButtons from "./SortButtons";
import FilterSection from "./FilterSection";
import { isOrdered, orderDates } from "../utils/filteringUtils";
import EditPatient from "./EditPatient";

type Parameter = {
  id: number;
  name: string;
  value: string;
  alarm: boolean;
};

export type Patient = {
  id: number;
  familyName: string;
  givenName: string;
  birthDate: Date;
  sex: string;
  parameters: Parameter[];
};

/**
 * Typescript type for HandleFilterFunction
 * every member except 'which' is optional and needed by the respective filter
 * @member which: which filter has to be set up 
 * @member e: event triggered by typing into familyName or givenName input Boxes,
 * @member dates: array of two dates returned by the Calendar date range selection
 * @member sex: takes the state (string) used to control sex checkboxes, it can be either one of 'M' , 'F', or 'MF' if both or neither checkboxes are selected
 * @member alarm: takes the state used to control the Alarm? checkbox it can be true or false
 */
export type HandleFilterType = {
  which: string;
  e?: React.FormEvent<HTMLInputElement>;
  dates?: Date[];
  sex?: "M" | "F" | "MF";
  alarm?: boolean;
};

const PatientGrid = () => {
  const [patientList, setPatientList] = useState<Patient[]>([]);
  const [searchFamilyItem, setSearchFamilyItem] = useState<string>("");
  const [searchGivenItem, setSearchGivenItem] = useState<string>("");
  const [searchDateItem, setSearchDateItem] = useState<Date[]>([
    new Date(" Jan 01 0100 00:00:00 GMT+0100 (Central European Standard Time)"),
    new Date(
      "Thu Jan 01 2125 00:00:00 GMT+0100 (Central European Standard Time)"
    ),
  ]);
  const [searchSexItem, setSearchSexItem] = useState<"M" | "F" | "MF">("MF");
  const [searchAlarmedItem, setSearchAlarmedItem] = useState<boolean>(false);
  const [filteredList, setFilteredList] = useState<Patient[]>([]);

  //GET Patients list
  async function getPatientList() {
    try {
      await axios
        .get("https://mobile.digistat.it/CandidateApi/Patient/GetList", {
          auth: {
            username: import.meta.env.VITE_API_USER,
            password: import.meta.env.VITE_API_PASS,
          },
        })
        .then((response) => {
          setPatientList(response.data);
          setFilteredList(response.data);
        });
    } catch {
      console.log("failed to retrieve datas from API");
    }
  }

  /**
   * This useEffect handles all filteredList state changes and sets the list used to map each element of the table
   * 
   */
  useEffect(() => {
    const filteredItems = patientList.filter(
      (pat) =>
        pat.familyName.toLowerCase().includes(searchFamilyItem.toLowerCase()) &&
        pat.givenName.toLowerCase().includes(searchGivenItem.toLowerCase()) &&
        pat.birthDate.toLocaleString() >= searchDateItem[0].toJSON() &&
        pat.birthDate.toLocaleString() <= searchDateItem[1].toJSON() &&
        (pat.sex === searchSexItem || searchSexItem === "MF") &&
        searchAlarmedItem === alarm(pat.parameters)
    );
    setFilteredList(filteredItems);
  }, [
    searchFamilyItem,
    searchGivenItem,
    searchDateItem,
    searchSexItem,
    searchAlarmedItem,
  ]);

  /**
   * Sorts List of patients, reverse it on double click
   * @param by
   */
  const sortList = (by: string) => {
    const orderedList = [...filteredList];
    switch (by) {
      case "familyName": {
        orderedList.sort((a, b) => a.familyName.localeCompare(b.familyName));
        break;
      }
      case "givenName": {
        orderedList.sort((a, b) => a.givenName.localeCompare(b.givenName));
        break;
      }
      case "birthDate": {
        orderedList.sort((a, b) =>
          a.birthDate
            .toLocaleString()
            .localeCompare(b.birthDate.toLocaleString())
        );
        break;
      }
      case "sex": {
        orderedList.sort((a, b) => a.sex.localeCompare(b.sex));
        break;
      }
      case "numberOfParams": {
        orderedList.sort((a, b) => b.parameters.length - a.parameters.length);
        break;
      }
    }
    if (isOrdered(filteredList, orderedList)) orderedList.reverse();
    setFilteredList(orderedList);
  };

  /**
   *
   * Look at HandleFilterType for more informations on how filters work
   * @param param0
   * @type {HandleFilterType}
   */
  const handleFilter = ({
    which,
    e,
    dates: date,
    sex,
    alarm,
  }: HandleFilterType) => {
    switch (which) {
      case "family": {
        const searchTerm = e!.currentTarget.value;
        setSearchFamilyItem(searchTerm);
        break;
      }
      case "given": {
        const searchTerm = e!.currentTarget.value;
        setSearchGivenItem(searchTerm);
        break;
      }
      case "birthDate": {
        const searchTerm = orderDates(date!);
        setSearchDateItem(searchTerm);
        break;
      }
      case "sex": {
        const searchTerm = sex!;
        setSearchSexItem(searchTerm);
        break;
      }
      case "alarm": {
        const searchTerm = alarm!;
        setSearchAlarmedItem(searchTerm);
        break;
      }
    }
  };

  /**
   * check if at least one parameter has alarm === true
   * @param params - parameters list for one patient
   * @returns {true | false}
   */
  const alarm = (params: Parameter[]) => {
    for (let i = 0; i < params.length; i++) {
      if (params[i].alarm === true) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    getPatientList();
  }, []);

  return (
    <div className="">
      <table className="table-fixed">
        <thead>
          <tr className="text-[#121e28]">
            <th>Family Name</th>
            <th>Given Name</th>
            <th>Birth Date</th>
            <th>Sex</th>
            <th>Number of Parameters</th>
          </tr>
        </thead>
        <tbody>
          {filteredList[0] ? (
            filteredList.map(
              ({ id, familyName, givenName, birthDate, sex, parameters }, idx) => (
                    <tr key={idx}>
                        <td>{familyName}</td>
                        <td>{givenName}</td>
                        <td>{new Date(birthDate).toLocaleDateString("it-IT")}</td>
                        <td className="text-center">{sex}</td>
                        <td className={`${alarm(parameters) ? "bg-red-600 " : ""}`}>
                          <div className="w-full flex justify-center">
                            {parameters.length}
                          </div>
                        </td>
                        <EditPatient patient={{ id, familyName, givenName, birthDate, sex, parameters }} idx={idx}/>
                    </tr>
              )
            )
          ) : (
            <tr>
              <td>
                <div>No results found</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <SortButtons sortList={sortList} />
      <FilterSection
        searchFamilyItem={searchFamilyItem}
        searchGivenItem={searchGivenItem}
        handleFilter={handleFilter}
      />
    </div>
  );
};

export default PatientGrid;
