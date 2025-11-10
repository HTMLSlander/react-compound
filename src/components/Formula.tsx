import { useRef, useState } from "react";
import Test from "./Test";

interface FormDataProps {
  startingBalance: number;
  contribution: number;
  years: number;
  interestRate: number;
  compoundFrequency: number;
}
export let labels: String[] | any = [];
export let arrYears: String[] | any = [];

const Formula = () => {
  const [formData, setFormData] = useState<FormDataProps>({
    startingBalance: 0,
    contribution: 0,
    years: 0,
    interestRate: 0,
    compoundFrequency: 12,
  });

  const [results, setResults] = useState<number | string>(0);
  const [isError, setIsError] = useState<boolean | null>(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: +value,
    }));
  };

  const handleCompoundInterestFormula = (e: any) => {
    // A = P(1 + r/n)**nt + PMT((1 + r/n)**nt - 1)(r/n)
    e.preventDefault();

    let arrData = [];
    for (let data in formData) {
      arrData.push(+formData[data]);
    }
    const {
      startingBalance,
      contribution,
      years,
      interestRate,
      compoundFrequency,
    } = formData;

    const P = startingBalance.toFixed(2);
    const PMT = contribution.toFixed(2);
    const t = years;
    const rPrcnt = interestRate / 100;
    const n = compoundFrequency;

    const finalResult =
      P * (1 + rPrcnt / n) ** (n * t) +
      PMT * ((1 + rPrcnt / n) ** (n * t) - 1) * (rPrcnt / n);

    // console.log(
    //   arrData.filter((data) => {
    //     Number.isFinite(data) === true;
    //   }).length !== arrData.length
    // );
    if (
      !(
        arrData.filter((data) => {
          Number.isFinite(data);
        }).length !== arrData.length
      )
    ) {
      setIsError(true);
      setResults("Invalid input");
      return;
    }
    if (t <= 0 || n <= 0) {
      setIsError(true);
      setResults("Years and compound frequency must be greater than 0");
      return;
    }
    setResults(finalResult.toFixed(2));

    for (let year = 0; year <= years; year++) {
      let calculate =
        P * (1 + rPrcnt / n) ** (n * year) +
        PMT * ((1 + rPrcnt / n) ** (n * year) - 1) * (rPrcnt / n);
      arrYears.push(calculate);
      labels.push(`Year-${year < 10 ? `0${year}` : year}`);
    }
    console.log(arrYears, labels);
  };
  return (
    <>
      <form
        id="interest-calculator"
        className="flex flex-col justify-center align-center bg-white p-[20px] rounded-lg shadow-md"
        onSubmit={handleCompoundInterestFormula}
      >
        <h2 className="font-black text-2xl text-center mb-[20px]">
          💵 Compound Interest Calculator
        </h2>
        <h2>{isError && `Error message`}</h2>
        <p className="formula">
          Formula:{" "}
          <em>
            A = P(1 + r/n)<sup>nt</sup> + PMT((1 + r/n)<sup>nt</sup> - 1)(r/n)
          </em>
        </p>
        <div className="form-control">
          <label htmlFor="starting-balance">Starting Balance (P):</label>
          <input
            type="text"
            id="starting-balance"
            name="startingBalance"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="contribution">Contribution (PMT): </label>
          <input
            type="text"
            id="contribution"
            name="contribution"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="years">Years (t): </label>
          <input
            type="text"
            id="years"
            name="years"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="interest-rate">% Interest Rate (r): </label>
          <input
            type="text"
            id="interest-rate"
            name="interestRate"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="compound">Compound Frequency (n):</label>
          <select
            name="compoundFrequency"
            id="compound"
            onChange={handleChange}
            defaultValue={12}
            required
          >
            <option value={365}>Daily</option>
            <option value={12}>Monthly</option>
            <option value={1}>Annualy</option>
          </select>
        </div>
        <button id="calculate-button" type="submit">
          Calculate
        </button>
        <div id="result">{results}</div>
      </form>
      <Test />
    </>
  );
};

export default Formula;
