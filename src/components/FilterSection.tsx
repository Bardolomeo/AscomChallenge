
type FilterProps = {
	handleFilter: (by: string) => void;
	handleSearch: (e: React.FormEvent<HTMLInputElement>, which: string) => void;
	searchFamilyItem: string;
	searchGivenItem: string;
}

const FilterSection = ({handleFilter, handleSearch, searchFamilyItem, searchGivenItem} : FilterProps) => {
  
	const buttonCN = "rounded-full border-[1px] border-solid border-black px-3 py-1 w-32 shadow-lg hover:bg-[#E0E0E0] font-semibold bg-[#AD9494]"

	return (
	<div className="pt-8">
		<h3 className="font-sans font-semibold pb-4 text-xl">Filters:</h3>
		<div className="flex gap-2 items-center">
		<input 
		className="border-[1px] border-solid border-black focus:border-2"
		type="text"
		value={searchFamilyItem}
		onChange={(e) => handleSearch(e, 'family')}
		placeholder="Insert Family Name"
		/>
		<input 
		className="border-[1px] border-solid border-black focus:border-2"
		type="text"
		value={searchGivenItem}
		onChange={(e) => handleSearch(e, 'given')}
		placeholder="Insert Given Name"
		/>
		<button
		onClick={() => handleFilter('birthDate')}
		className={buttonCN}>
			Birth Date
		</button>
		<button
		onClick={() => handleFilter('sex')}
		className={buttonCN}>
			Sex
		</button>
		<button
		onClick={() => handleFilter('numberOfParams')}
		className={buttonCN}>
			Parameters
		</button>
	</div>
</div>
  )
}

export default FilterSection