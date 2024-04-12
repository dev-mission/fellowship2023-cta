import { useState, useEffect } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

Dropdown.propTypes = {
  settings: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  lookUp: PropTypes.func.isRequired,
};

export default function Dropdown({lookUp, settings, path }) {
  const [singleSelections, setSingleSelections] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch(path)
      .then((res) => res.json())
      .then((data) => {
        setOptions(data);
      });
  }, []);

  return (
    <>
      <Form.Group>
        <Form.Label>{settings.title}</Form.Label>
        <Typeahead
          name={settings.id}
          id={settings.id}
          value={singleSelections[0].id}
          labelKey={settings.labelKey}
          onChange={(value) => {
            setSingleSelections(value);
            lookUp();
          }}
          options={options}
          placeholder={settings.placeholder}
          selected={singleSelections}
        />
      </Form.Group>
    </>
  );
}
