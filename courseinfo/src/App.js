const Course = (props) => {
	return (
		<div>
			<Header course={props.course.name} />
			<Content parts={props.course.parts} />
			<Total parts={props.course.parts} />
		</div>
	);
};

const Header = (props) => {
	return <h2>{props.course}</h2>;
};

const Part = (props) => {
	return (
		<p>
			{props.name} {props.exercises}
		</p>
	);
};

const Content = (props) => {
	return (
		<div>
			{props.parts.map((part) => (
				<Part key={part.id} name={part.name} exercises={part.exercises} />
			))}
		</div>
	);
};

const Total = (props) => {
	const total = props.parts.reduce((sum, part) => sum + part.exercises, 0);
	return <h4>Total of exercises {total}</h4>;
};

const App = () => {
	const courses = [
		{
			name: 'Half Stack application development',
			id: 1,
			parts: [
				{
					name: 'Fundamentals of React',
					exercises: 10,
					id: 1,
				},
				{
					name: 'Using props to pass data',
					exercises: 7,
					id: 2,
				},
				{
					name: 'State of a component',
					exercises: 14,
					id: 3,
				},
				{
					name: 'Redux',
					exercises: 11,
					id: 4,
				},
			],
		},
		{
			name: 'Node.js',
			id: 2,
			parts: [
				{
					name: 'Routing',
					exercises: 3,
					id: 1,
				},
				{
					name: 'Middlewares',
					exercises: 7,
					id: 2,
				},
			],
		},
	];

	return (
		<div>
			<h1>Web development curriculum</h1>
			{courses.map((course) => (
				<Course key={course.id} course={course} />
			))}
		</div>
	);
};
export default App;
