import axios from "axios";
import { useEffect, useState } from "react";
import SortButtons from "./SortButtons";
import FilterSection from "./FilterSection";
import { orderDates } from "../utils/filteringUtils";

type Parameter = {
  id: number;
  name: string;
  value: string;
  alarm: boolean;
};

type Patient = {
  id: number;
  familyName: string;
  givenName: string;
  birthDate: Date;
  sex: string;
  parameters: Parameter[];
};

export type handleFilterType = {
  which: string;
  e?: React.FormEvent<HTMLInputElement>;
  date?: Date[];
  sex?: "M" | "F" | "MF";
  alarm?: boolean;
};

const PatientGrid = () => {
  const [patientList, setPatientList] = useState<Patient[]>([]);
  const [searchFamilyItem, setSearchFamilyItem] = useState<string>("");
  const [searchGivenItem, setSearchGivenItem] = useState<string>("");
  const [searchDateItem, setSearchDateItem] = useState<Date[]>([new Date(" Jan 01 0100 00:00:00 GMT+0100 (Central European Standard Time)"), new Date("Thu Jan 01 2125 00:00:00 GMT+0100 (Central European Standard Time)")]);
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


  useEffect( () => {
    const filteredItems = patientList.filter(
    (pat) =>
      pat.familyName.toLowerCase().includes(searchFamilyItem.toLowerCase()) &&
      pat.givenName.toLowerCase().includes(searchGivenItem.toLowerCase()) &&
      (pat.birthDate.toLocaleString() >= searchDateItem[0].toJSON() && pat.birthDate.toLocaleString() <= searchDateItem[1].toJSON()) &&
      (pat.sex === searchSexItem || searchSexItem === "MF") &&
      (searchAlarmedItem === alarm(pat.parameters))
  );
  setFilteredList(filteredItems);
  }, [searchFamilyItem, searchGivenItem, searchDateItem, searchSexItem, searchAlarmedItem]);

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
        orderedList.sort((a, b) => b.parameters.length -  a.parameters.length);
        break;
      }
    }
    setFilteredList(orderedList);
  };

  const handleFilter = ({ which, e, date, sex, alarm }: handleFilterType) => {
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
      case "sex":
      {
        const searchTerm = sex!;
        setSearchSexItem(searchTerm);
        break;
      }
      case "alarm":
      {
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
    <div>
      <table className="table-fixed">
        <thead>
          <tr>
            <th>Family Name</th>
            <th>Given Name</th>
            <th>Birth Date</th>
            <th>Sex</th>
            <th>Number of Parameters</th>
          </tr>
        </thead>
        <tbody>
          {filteredList[0] ? (
            filteredList.map((pat) => (
              <tr key={pat.id}>
                <td>{pat.familyName}</td>
                <td>{pat.givenName}</td>
                <td>{new Date(pat.birthDate).toLocaleDateString("it-IT")}</td>
                <td>{pat.sex}</td>
                <td className={`${alarm(pat.parameters) ? "bg-red-600 " : ""}`}>
                  <div className="w-full flex justify-center">{pat.parameters.length}</div>
                </td>
              </tr>
            ))
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
