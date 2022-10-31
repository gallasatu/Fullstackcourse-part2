import { useState } from 'react';

const Filter = (props) => {
	return (
		<div>
			filter shown with{' '}
			<input value={props.filterName} onChange={props.handleFilterName} />
		</div>
	);
};

const PersonForm = (props) => {
	return (
		<form onSubmit={props.addPersons}>
			<div>
				name: <input value={props.newName} onChange={props.handleNewName} />
			</div>
			<div>
				number:{' '}
				<input value={props.newNumber} onChange={props.handleNewNumber} />
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	);
};

const Person = (props) => {
	return (
		<p>
			{props.name} {props.number}
		</p>
	);
};

const Persons = (props) => {
	return props.namesToShow.map((person) => (
		<Person key={person.name} name={person.name} number={person.number} />
	));
};

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [filterName, setFilterName] = useState('');

	const addPersons = (event) => {
		event.preventDefault();

		if (newName !== '' && newNumber !== '') {
			if (persons.find((person) => person.name === newName)) {
				alert(`${newName} is already added to phonebook`);
			} else if (persons.find((person) => person.number === newNumber)) {
				alert(`Number ${newNumber} is already added to phonebook`);
			} else {
				const personObject = {
					name: newName,
					number: newNumber,
				};
				setPersons(persons.concat(personObject));
				setNewName('');
				setNewNumber('');
			}
		}
	};

	const namesToShow =
		filterName === ''
			? persons
			: persons.filter((person) =>
					person.name.toLowerCase().includes(filterName.toLowerCase())
			  );

	const handleNewName = (event) => {
		setNewName(event.target.value);
	};

	const handleNewNumber = (event) => {
		setNewNumber(event.target.value);
	};

	const handleFilterName = (event) => {
		setFilterName(event.target.value);
	};

	return (
		<>
			<h2>Phonebook</h2>
			<Filter filterName={filterName} handleFilterName={handleFilterName} />
			<h2>Add a new</h2>
			<PersonForm
				addPersons={addPersons}
				newName={newName}
				handleNewName={handleNewName}
				newNumber={newNumber}
				handleNewNumber={handleNewNumber}
			/>
			<h2>Numbers</h2>
			<Persons namesToShow={namesToShow} />
		</>
	);
};

export default App;
