import { FormEvent, useRef } from "react";
import { useState } from "react";
import { FaEdit } from "react-icons/fa"
import { Patient } from "./PatientGrid";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
gsap.registerPlugin(useGSAP);

type EditPatient = 
{
	patient : Patient;
	idx: number
	getPatientList: () => void;
};

const EditPatient = ({patient, idx, getPatientList = () => {}} : EditPatient) => {

  const [editPatient, setEditPatient] = useState<Patient | undefined>(null!);
  const tableRef = useRef<HTMLDivElement>(null!);
  const wrapperRef = useRef<HTMLDivElement>(null!);
  const { id, familyName, givenName, birthDate, sex, parameters } = patient;
  const postFamName = useRef<HTMLInputElement>(null!);
  const postGivName = useRef<HTMLInputElement>(null!);
  const postDate = useRef<HTMLInputElement>(null!);
  const postSex = useRef<HTMLInputElement>(null!);

  const submitForm = async (e : FormEvent<HTMLFormElement>) => {

	e.preventDefault();
	const date = postDate.current.value.split('/');
			await axios.post("https://mobile.digistat.it/CandidateApi/Patient/Update", {
				id: id,
				familyName: postFamName.current.value,
				givenName: postGivName.current.value,
				birthDate: new Date(Number(date[2]), Number(date[1]) - 1, Number(date[0])),
				sex: postSex.current.value.toUpperCase(),
				parameters: parameters,
			}, {
			auth: {
				username: import.meta.env.VITE_API_USER,
				password: import.meta.env.VITE_API_PASS,
			  }},).then(() => {
				getPatientList();
				setEditPatient(undefined);
			  }).catch((e) => alert(e))
  }

  useGSAP(() => {
	if (editPatient != undefined)
	{
		gsap.timeline()
		.to(wrapperRef.current, {opacity: 1, pointerEvents: 'auto', duration: 0.25})
		.to(tableRef.current, {height: 'auto', overflowY: 'scroll', duration: 0.5, ease: 'power1.inOut'});
	}
	else if (editPatient === undefined)
	{
		gsap.timeline()
		.to(tableRef.current, {height: 2, overflowY: 'hidden', duration: 0.5, ease: 'power1.inOut'})
		.to(wrapperRef.current, {opacity: 0, pointerEvents: 'none', duration: 0.25});

	}
  }, [editPatient])

  return (
	<td className="bg-transparent border-none">
		<div className="pr-8 scale-150 opacity-70">
			<button onClick={() => setEditPatient(patient)}>
				<FaEdit/>
			</button>
		</div>
		<div 
		  className="absolute w-full h-full flex items-center justify-center top-0 left-0 overflow-hidden bg-black bg-opacity-30 opacity-0
		  pointer-events-none z-20"
		  ref={wrapperRef}>
			<div 
			className="flex flex-col bg-[#EBEAEA] text-center border-solid border-4 border-gray-800 rounded-md p-6 max-h-[80vh] h-0 overflow-hidden"
			ref={tableRef}>
				<div className="w-full flex justify-end">
					<button onClick={() => setEditPatient(undefined)} className="scale-150 pb-6">
						<IoMdClose/>
					</button>
				</div>
				<h1 className="self-start text-lg font-semibold pb-2">Edit Fields</h1>
				<form
				  className="grid grid-cols-4"
				  onSubmit={(e) => submitForm(e)}>
					<input
					  id={"postFamilyName" + idx}
					  className="border-solid pl-2 border-y-2 border-l-2 border-gray-800 bg-white"
					  defaultValue={familyName}
					  ref={postFamName}
					  />
					<input 
					  id={"postGivenName" + idx}
					  className="border-solid pl-2 border-y-2 border-l-2 border-gray-800 bg-white"
					  defaultValue={givenName}
					  ref={postGivName}
					  />
					<input 
					  id={"postBirthDate" + idx}
					  className="border-solid pl-2 border-y-2 border-l-2 border-gray-800 bg-white"
					  defaultValue={new Date(birthDate).toLocaleDateString("it-IT")}
					  ref={postDate}
					  />
					<input
					  id={"postSex" + idx}
					  className="border-solid pl-2 border-y-2 border-x-2 border-gray-800 bg-white"
					  defaultValue={sex}
					  ref={postSex}
					  />
					<div className="col-span-full pt-4">
						<button type="submit" className="rounded-full border-2 border-solid border-[#497faa] px-3 py-1 w-32 shadow-lg hover:bg-[#9db6cd] hover:border-[#9db6cd] hover:text-white font-semibold bg-[#white] text-[#497faa]">Submit</button>
					</div>
				</form>
				<h1 className="self-start text-lg font-semibold pt-6 pb-2">Parameters List</h1>
				<div className="grid border-y-[1px] borrder-solid border-gray-800">
					{parameters.map((par, idx) => (
						<div key={idx} className={`grid w-full grid-cols-2 border-solid border-x-2 border-y-[1px] border-gray-800 ${par.alarm === true ? 'bg-red-600 text-white' : 'bg-white'}`}>
							<div className="border-r-2 border-gray-800 border-solid">{par.name}</div>
							<div>{par.value}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	</td>
  )
}

export default EditPatient