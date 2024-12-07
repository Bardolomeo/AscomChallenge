import { Patient } from "../components/PatientGrid";

export function orderDates(dates: Date[])
{
  let retDateArr: Date[] = [];
  if (dates.length === 1)
  {
	retDateArr.push(dates[0]);
	retDateArr.push(new Date("Thu Feb 01 1945 23:59:59 GMT+0100 (Central European Standard Time)"));
	return (retDateArr);
  }
  if (dates[0] > dates[1])
  {
	  retDateArr.push(dates[1]);
	  retDateArr.push(dates[0]);
  } else {
	  retDateArr.push(dates[0]);
	  retDateArr.push(dates[1]);
  }

  return retDateArr;
}

export function isOrdered(src: Patient[], ordered: Patient[]) {
  for (let i = 0; i < ordered.length; i++)
    if (ordered[i] !== src[i])
      return false;
  return true;
}