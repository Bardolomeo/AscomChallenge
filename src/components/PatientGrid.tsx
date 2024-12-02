import axios from "axios";
import { useEffect, useState } from "react";
import SortButtons from "./SortButtons";
import FilterSection from "./FilterSection";


type Parameter = {
	id : number;
	name : string;
	value : string;
	alarm : boolean;
}

type Patient = {
	id : number;
	familyName : string;	
	givenName : string;
	birthDate : Date;
	sex : string;
	parameters : Parameter[];
}
const PatientGrid = () => {
	
	const [patientList, setPatientList] = useState<Patient[]>([]);
	const [searchFamilyItem, setSearchFamilyItem] = useState<string>('');
	const [searchGivenItem, setSearchGivenItem] = useState<string>('');
	const [searchDateItem, setSearchDateItem] = useState<string>('');
	const [filteredList, setFilteredList] = useState<Patient[]>([]);

	//GET Patients list
	async function getPatientList() {
		try {
			await axios.get('https://mobile.digistat.it/CandidateApi/Patient/GetList', {auth: {
			username: import.meta.env.VITE_API_USER,
			password: import.meta.env.VITE_API_PASS
			}}).then(response => {
				setPatientList(response.data); 
				setFilteredList(response.data);});
		} catch {
			console.log('failed to retrieve datas from API');
		}
	}

	
	const sortList = (by: string) =>
	{
		const orderedList = [...filteredList]; 
		switch (by){
			case 'familyName':{
				orderedList.sort((a, b) => a.familyName.localeCompare(b.familyName))
				break;
			}
			case 'givenName':{
				orderedList.sort((a, b) => a.givenName.localeCompare(b.givenName))
				break;
			}
			case 'birthDate':{
				orderedList.sort((a, b) => a.birthDate.toLocaleString().localeCompare(b.birthDate.toLocaleString()))
				break;
			}
			case 'sex':{
				orderedList.sort((a, b) => a.sex.localeCompare(b.sex))
				break;
			}
			case 'numberOfParams':{
				orderedList.sort((a, b) => a.parameters.length - b.parameters.length)
				break;
			}
		}
		setFilteredList(orderedList);
	}

	const handleSearch = async (e: React.FormEvent<HTMLInputElement>, which: string) =>
	{
		switch (which) {
			case 'family':
			{
				const searchTerm = e.currentTarget.value;
				setSearchFamilyItem(searchTerm);
				const filteredItems = patientList.filter((pat) => 
					(
						pat.familyName.toLowerCase().includes(searchTerm.toLowerCase()) 
						&& pat.givenName.toLowerCase().includes(searchGivenItem.toLowerCase()))
				);
				setFilteredList(filteredItems);
				break;
			}
			case 'given':
			{
				const searchTerm = e.currentTarget.value;
				setSearchGivenItem(searchTerm);
				const filteredItems = patientList.filter((pat) => 
					(
						pat.familyName.toLowerCase().includes(searchFamilyItem.toLowerCase()) && 
						pat.givenName.toLowerCase().includes(searchTerm.toLowerCase())) 
				);
				setFilteredList(filteredItems);
				break;
			}
			case 'date':
			{
				const searchTerm = e.currentTarget.value;
				setSearchDateItem(searchTerm);
				const filteredItems = patientList.filter((pat) => 
					(
						pat.familyName.toLowerCase().includes(searchFamilyItem.toLowerCase()) &&
						pat.givenName.toLowerCase().includes(searchTerm.toLowerCase()))
				);
				setFilteredList(filteredItems);
				break;
			}
		}
	}

	const filterList = (by: string) =>
		{
			const orderedList = [...patientList]; 
			switch (by){
				case 'familyName':{
					orderedList.sort((a, b) => a.familyName.localeCompare(b.familyName))
					break;
				}
				case 'givenName':{
					orderedList.sort((a, b) => a.givenName.localeCompare(b.givenName))
					break;
				}
				case 'birthDate':{
					orderedList.sort((a, b) => a.birthDate.toLocaleString().localeCompare(b.birthDate.toLocaleString()))
					break;
				}
				case 'sex':{
					orderedList.sort((a, b) => a.sex.localeCompare(b.sex))
					break;
				}
				case 'numberOfParams':{
					orderedList.sort((a, b) => a.parameters.length - b.parameters.length)
					break;
				}
			}
			setPatientList(orderedList);
		}

	/**
	* check if at least one parameter has alarm === true
	* @param params - parameters list for one patient
	* @returns {true | false}  
	*/
	const alarm = (params : Parameter[]) => {
		for (let i = 0; i < params.length; i++)
			{
				if (params[i].alarm === true){
				return (true)
			}
		}
		return false
	}


	useEffect(() => {
		getPatientList();
	}, [])

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
					{filteredList[0] ? filteredList.map((pat) => (
						<tr 
						key={pat.id}>
							<td>{pat.familyName}</td>
							<td>{pat.givenName}</td>
							<td>{new Date(pat.birthDate).toLocaleDateString('it-IT')}</td>
							<td>{pat.sex}</td>
							<td 
							className={`${alarm(pat.parameters) ? 'bg-red-600 ' : ''}`}>
								{pat.parameters.length}
							</td>
						</tr>
					)) : <tr><div>No results found</div></tr>}
				</tbody>
			</table>
			<SortButtons sortList={sortList}/>
			<FilterSection handleFilter={filterList} searchFamilyItem={searchFamilyItem} searchGivenItem={searchGivenItem} handleSearch={handleSearch}/>
		</div>
	)
}

export default PatientGrid