import { useState, useEffect } from 'react';
import axios from 'axios';

const CountriesForm = (props) => {
	return (
		<form>
			find countries:{' '}
			<input value={props.filterCountry} onChange={props.handleFilterCountry} />
		</form>
	);
};

const ShowCountry = (props) => {
	const [weather, setWeather] = useState();
	const api_key = process.env.REACT_APP_API_KEY;
	useEffect(() => {
		axios
			.get(
				`https://api.openweathermap.org/data/2.5/weather?q=${props.country.capital}&units=metric&appid=${api_key}`
			)
			.then((response) => {
				setWeather(response.data);
			});
	}, [api_key, props.country.capital]);

	return (
		<>
			<h1>{props.country.name.official}</h1>
			<p>capital {props.country.capital}</p>
			<p>area {props.country.area}</p>
			<h4>languages:</h4>
			<ul>
				{' '}
				{Object.values(props.country.languages).map((language) => (
					<li key={language}>{language}</li>
				))}
			</ul>
			<img src={props.country.flags.png} alt="country flag"></img>
			<h3>Weather in {props.country.capital}</h3>
			<p>temperature {weather?.main?.temp} Celsius</p>
			{!!weather && (
				<img
					src={`http://openweathermap.org/img/wn/${weather?.weather[0].icon}@2x.png`}
					alt="weather icon"
				></img>
			)}
			<p>wind {weather?.wind?.speed} m/s</p>
		</>
	);
};

const CountriesList = (props) => {
	return (
		<p>
			{props.country.name.official}
			<button
				onClick={() => props.setFilterCountry(props.country.name.official)}
			>
				show
			</button>
		</p>
	);
};

function App() {
	const [filterCountry, setFilterCountry] = useState('');
	const [countries, setCountries] = useState([]);

	useEffect(() => {
		axios
			.get('https://restcountries.com/v3.1/all')
			.then((response) => setCountries(response.data));
	}, []);

	const filteredCountry = countries.filter((country) =>
		country.name.official.toLowerCase().includes(filterCountry.toLowerCase())
	);

	const handleFilterCountry = (event) => {
		setFilterCountry(event.target.value);
	};

	return (
		<>
			<CountriesForm
				filterCountry={filterCountry}
				handleFilterCountry={handleFilterCountry}
			/>
			<div>
				{filteredCountry.length === 1 ? (
					<ShowCountry country={filteredCountry[0]} />
				) : filteredCountry.length > 1 && filteredCountry.length <= 10 ? (
					filteredCountry.map((country) => (
						<CountriesList
							key={country.name.official}
							country={country}
							setFilterCountry={setFilterCountry}
						/>
					))
				) : (
					<p>Too many matches, specify another filter</p>
				)}
			</div>
		</>
	);
}

export default App;
