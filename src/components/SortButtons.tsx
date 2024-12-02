

const SortButtons = ({sortList = (by: string) => {}}) => {
  
	const buttonCN = "rounded-full border-[1px] border-solid border-black px-3 py-1 w-32 shadow-lg hover:bg-[#E0E0E0] bg-[#AD9494]"

	return (
	<div className="pt-16">
		<h3 className="font-sans font-semibold pb-4 text-xl">Sort By:</h3>
		<div className="flex gap-2 items-center">
		<button
		onClick={() => sortList('familyName')}
		className={buttonCN}>
			Family Name
		</button>
		<button
		onClick={() => sortList('givenName')}
		className={buttonCN}>
			Given Name
		</button>
		<button
		onClick={() => sortList('birthDate')}
		className={buttonCN}>
			Birth Date
		</button>
		<button
		onClick={() => sortList('sex')}
		className={buttonCN}>
			Sex
		</button>
		<button
		onClick={() => sortList('numberOfParams')}
		className={buttonCN}>
			Parameters
		</button>
	</div>
</div>
  )
}

export default SortButtons