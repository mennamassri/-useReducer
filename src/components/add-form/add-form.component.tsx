import { useState } from 'react';
import './add-form.css';
import { IStudent } from '../../types';
import CoursesListForm from '../courses-list-form/courses-list-form.component';
import { useStudentForm } from '../../hooks/useStudentForm';

interface IProps {
  className?: string;
  onSubmit: (std: IStudent) => void;
}

const AddForm = (props: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    student,
    errorsList,
    handleChange,
    handleCoursesChange,
    handleSubmit,
    handleClear,
  } = useStudentForm(props.onSubmit);

  return (
    <div className={`wrapper ${props.className} ${isOpen ? 'open' : 'closed'}`}>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <span>&and; Close </span> : <span>&or; Open </span>}
        Add Form
      </button>
      <div className="input">
        <label htmlFor="name">Student Name: </label>
        <input
          id="name"
          type="text"
          value={student.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>
      <div className="input">
        <label htmlFor="age">Student Age: </label>
        <input
          id="age"
          type="number"
          min={17}
          max={40}
          value={student.age}
          onChange={(e) => handleChange('age', e.target.value)}
        />
      </div>
      <div className="input">
        <label htmlFor="isGraduated">Is Student Graduated: </label>
        <input
          id="isGraduated"
          type="checkbox"
          checked={student.isGraduated}
          onChange={(e) => handleChange('isGraduated', e.target.checked)}
        />
      </div>
      <div>
        <CoursesListForm value={student.coursesList} onSubmit={handleCoursesChange} />
      </div>
      <div className="Actions">
        <button
          onClick={handleSubmit}
          style={{ color: errorsList.length ? 'red' : 'initial' }}
        >
          Submit
        </button>
        <button onClick={handleClear}>Clear</button>
      </div>
      {Boolean(errorsList.length) && (
        <div className="report">
          <h4>You have the following error/s:</h4>
          {errorsList.map((error) => (
            <p key={error}>- {error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddForm;
