import { useState } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import PropTypes from 'prop-types';

const DropMenu = ({ lookUp, settings }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState();

  const handleSearch = (query) => {
    setIsLoading(true);
    fetch(`/api/${settings.route}/search/${query}`)
      .then((resp) => resp.json())
      .then((items) => {
        setOptions(items);
        setIsLoading(false);
      });
  };

  const filterBy = () => true;

  return (
    <AsyncTypeahead
      filterBy={filterBy}
      id={`search-${settings.route}`}
      isLoading={isLoading}
      labelKey={settings.labelKey}
      onSearch={handleSearch}
      options={options}
      onChange={(value) => {
        lookUp({ target: { name: settings.id, value: value[0]?.id } });
      }}
      placeholder={settings.placeholder}
      defaultInputValue={settings.name}
    />
  );
};

DropMenu.propTypes = {
  lookUp: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
};

export default DropMenu;
