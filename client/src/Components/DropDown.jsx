import { useState, useEffect } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

Dropdown.propTypes = {
  setData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
};

export default function Dropdown({ setData, data, settings, path }) {
  const [singleSelections, setSingleSelections] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch(path)
      .then((res) => res.json())
      .then((data) => {
        setOptions(data);
      });
  }, [setData, data, settings, path]);

  return (
    <>
      <Form.Group>
        <Form.Label>{settings.title}</Form.Label>
        <Typeahead
          id={settings.id}
          labelKey={settings.labelKey}
          onChange={(value) => {
            setSingleSelections(value);
            setData({ ...data, [settings.id]: value[0]?.id });
          }}
          options={options}
          placeholder={settings.placeholder}
          selected={singleSelections}
        />
      </Form.Group>
    </>
  );
}
