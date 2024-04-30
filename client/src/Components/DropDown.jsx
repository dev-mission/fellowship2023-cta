import { useState, useEffect } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

DropDown.propTypes = {
  settings: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  lookUp: PropTypes.func.isRequired,
};

export default function DropDown({ lookUp, settings, path }) {
  const [singleSelections, setSingleSelections] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch(path)
      .then((res) => res.json())
      .then((data) => {
        setOptions(data);
      });
  }, [path]);

  return (
    <>
      <Form.Group>
        <Form.Label>{settings.title}</Form.Label>
        <Typeahead
          id={settings.id}
          labelKey={settings.labelKey}
          onChange={(value) => {
            setSingleSelections(value);
            lookUp({ target: { name: settings?.id, value: value[0]?.id } });
          }}
          options={options}
          placeholder={settings.placeholder}
          selected={singleSelections}
          defaultInputValue={settings.name}
        />
      </Form.Group>
    </>
  );
}
