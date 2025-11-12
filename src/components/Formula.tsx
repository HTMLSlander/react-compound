import { useState } from "react";
import InterestChart from "./InterestChart";
import { useCurrencyInput } from "../hooks/useCurrencyInput";

interface FormDataProps {
  startingBalance: number;
  contribution: number;
  years: number;
  interestRate: number;
  compoundFrequency: number;
}

const Formula = () => {
  const [startingBalance, startingBalanceBind] = useCurrencyInput();
  const [contribution, contributionBind] = useCurrencyInput();
  const [formData, setFormData] = useState<FormDataProps>({
    startingBalance: 0,
    contribution: 0,
    years: 0,
    interestRate: 0,
    compoundFrequency: 12,
  });
  const [labels, setLabels] = useState<string[] | null>([]);
  const [arrYears, setArrYears] = useState<number[] | null>([]);
  const [results, setResults] = useState<number | string | undefined>();
  const [isError, setIsError] = useState<boolean | null>(false);

  // Format numbers to dollar

  const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: +value,
    }));
  };

  const handleCompoundInterestFormula = (e: any) => {
    // A = P(1 + r/n)**nt + PMT((1 + r/n)**nt - 1) / (r/n)
    e.preventDefault();

    const newLabels: string[] | null = [];
    const newArrYears: number[] | null = [];
    let arrData: any[] = [];
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

    const P = startingBalance;
    const PMT = contribution;
    const t = years;
    const rPrcnt = interestRate / 100;
    const n = compoundFrequency;
    const excerpt = (1 + rPrcnt / n) ** (n * t);

    const finalResult = P * excerpt + (PMT * (excerpt - 1)) / (rPrcnt / n);

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
      newArrYears.push(calculate);
      newLabels.push(`Year-${year < 10 ? `0${year}` : year}`);
    }
    setArrYears(newArrYears);
    setLabels(newLabels);
    console.log(arrYears, labels);
  };
  const formatStartingBalance = USDollar.format(formData.startingBalance);
  const formatContribution = USDollar.format(formData.contribution);
  const formatResults = USDollar.format(+results);
  return (
    <>
      <form
        id="interest-calculator"
        className=" max-w-[400px] flex flex-col justify-center align-center bg-white p-[20px] rounded-lg shadow-md"
        onSubmit={handleCompoundInterestFormula}
      >
        <h2 className="font-black text-2xl text-center mb-[20px]">
          Welcome to my compound interest Calculator!
        </h2>
        <h2>{isError && `Error message`}</h2>
        <p className="formula">
          Formula:{" "}
          <em>
            A = P(1 + r/n)<sup>nt</sup> + PMT((1 + r/n)<sup>nt</sup> - 1) /
            (r/n)
          </em>
        </p>
        <div className="form-control">
          <label htmlFor="starting-balance">Starting Balance (P):</label>
          <input
            type="text"
            id="starting-balance"
            name="startingBalance"
            {...handleChange(e, setFormData)}
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="contribution">Contribution (PMT): </label>
          <input
            type="text"
            id="contribution"
            name="contribution"
            {...contributionBind}
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
      </form>
      {results && (
        <main>
          <section className="results mx-[20px] my-0 mt-[2rem] flex flex-col gap-y-[15px]">
            <h2 id="result">Your Results</h2>
            <p>Constant investment will get you to {formatResults}</p>
            <InterestChart labels={labels} arrYears={arrYears} />
          </section>
        </main>
      )}
    </>
  );
};

export default Formula;
