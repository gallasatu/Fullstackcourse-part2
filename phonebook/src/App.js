import { useState, useEffect } from 'react';
import personService from './services/persons';

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
		<p className="person">
			{props.name} {props.number}{' '}
			<button
				onClick={() => {
					if (window.confirm(`Delete ${props.name} ?`)) {
						personService
							.deletePerson(props.id)
							.then(() => props.fetchPersons());
						props.setNotificationMessage({
							content: `Successfully deleted ${props.name}`,
							label: 'success',
						});
						setTimeout(() => {
							props.setNotificationMessage({ content: '' });
						}, 5000);
					}
				}}
			>
				delete
			</button>
		</p>
	);
};

const Persons = (props) => {
	return props.namesToShow.map((person) => (
		<Person
			key={person.name}
			name={person.name}
			number={person.number}
			id={person.id}
			fetchPersons={props.fetchPersons}
			setNotificationMessage={props.setNotificationMessage}
		/>
	));
};

const Notification = ({ message }) => {
	if (message.content === '') return null;

	return <div className={message.label}>{message.content}</div>;
};

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [filterName, setFilterName] = useState('');
	const [notificationMessage, setNotificationMessage] = useState('');

	const addPersons = (event) => {
		event.preventDefault();

		if (newName !== '' && newNumber !== '') {
			if (
				persons.find(
					(person) =>
						person.number === newNumber &&
						persons.find((person) => person.name === newName)
				)
			) {
				alert(`${newName} is already added to phonebook`);
			} else if (persons.find((person) => person.name === newName)) {
				if (
					window.confirm(
						`${newName} is already added to phonebook, replace the old number with a new one?`
					)
				) {
					const person = persons.find((person) => person.name === newName);
					const changedPerson = { ...person, number: newNumber };
					const id = person.id;

					personService
						.update(id, changedPerson)
						.then((returnedPerson) => {
							setPersons(
								persons.map((person) =>
									person.id !== id ? person : returnedPerson
								)
							);
							setNotificationMessage({
								content: `Successfully edited ${newName} `,
								label: 'success',
							});
							setTimeout(() => {
								setNotificationMessage({ content: '' });
							}, 5000);
						})
						.catch((error) => {
							setNotificationMessage({
								content: `Information of ${person.name} has already been removed from server `,
								label: 'error',
							});

							setTimeout(() => {
								setNotificationMessage({
									content: '',
								});
							}, 5000);

							setPersons(persons.filter((n) => n.id !== id));
						});
					setNewName('');
					setNewNumber('');
				}
			} else if (persons.find((person) => person.number === newNumber)) {
				alert(`Number ${newNumber} is already added to phonebook`);
			} else {
				const personObject = {
					name: newName,
					number: newNumber,
				};
				personService.create(personObject).then((returnedPersons) => {
					setPersons(persons.concat(returnedPersons));
					setNewName('');
					setNewNumber('');
					setNotificationMessage({
						content: `Successfully added ${personObject.name}`,
						label: 'success',
					});
					setTimeout(() => {
						setNotificationMessage({ content: '' });
					}, 5000);
				});
			}
		} else {
			alert(`Please, fill in all the boxes`);
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

	const fetchPersons = () => {
		personService.getAll().then((returnedPersons) => {
			setPersons(returnedPersons);
		});
	};
	useEffect(() => {
		fetchPersons();
	}, []);

	return (
		<>
			<h1>Phonebook</h1>
			<Notification message={notificationMessage} />
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
			<Persons
				namesToShow={namesToShow}
				fetchPersons={fetchPersons}
				setNotificationMessage={setNotificationMessage}
			/>
		</>
	);
};

export default App;
