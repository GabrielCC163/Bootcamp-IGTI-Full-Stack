function calculatePercentages(fullSalary, discountINSS, discountIRPF, netSalary) {
	let percDiscountINSS = 0; //orange
	let percDiscountIRPF = 0; //red
	let percNetSalary = 0; // green

	if (fullSalary > 0) {
		//prettier-ignore
		percDiscountINSS = (100 * discountINSS) / fullSalary;
		//prettier-ignore
		percDiscountIRPF = (100 * discountIRPF) / fullSalary;
		//prettier-ignore
		percNetSalary = (100 * netSalary) / fullSalary;
	}

	return {
		percDiscountINSS,
		percDiscountIRPF,
		percNetSalary
	};
}

export { calculatePercentages };
